from django.shortcuts import render
from rest_framework.views import APIView
from django.http import JsonResponse

import math
import random
import json
import os
import numpy as np
import pickle
import pandas as pd

# Create your views here.

class CoatingAPI(APIView):
    def post(self, request):
        print('coating simulation')
        _body = json.loads(request.body.decode("utf-8"))
        # print(type(_body),_body)
        ml_folder_path = "manufacturing/ml_models/"
        with open(ml_folder_path+"batwoman_coating_ml_model_v2.pickle", 'rb') as f:
            coating_loading_model = pickle.load(f)
        with open(ml_folder_path+'batwoman_coating_ml_model_dryness_voting.pickle', 'rb') as f:
            coating_drying_model = pickle.load(f)
        with open(ml_folder_path+'coating_scaler.pkl', 'rb') as f:
            coating_scaler = pickle.load(f)
        input_values = []
        for i in _body:
            if i['value'] == 'No':
                input_values.append(0.)
            elif i['value'] == 'Yes':
                input_values.append(1.)
            else:
                input_values.append(float(i['value']))
        # loading prediction
        coating_inputs = np.array([[input_values[1], input_values[0]]]) # gap, speed
        loading_pred = coating_loading_model.predict(coating_inputs)[0].round(2)

        # drying prediction
        coating_drying_inputs = np.array([[input_values[0], input_values[1], # gap, speed
                                           input_values[2], input_values[9], # IR, heat gun
                                           input_values[3], input_values[4], # oven1 temp, oven1 time
                                           input_values[5], input_values[6], # oven2 temp, oven2 time
                                           input_values[7], input_values[8] # oven3 temp, oven3 time
                                           ]]) 
        X_new_scaled = coating_scaler.transform(coating_drying_inputs)
        proba_predictions_new = coating_drying_model.predict_proba(X_new_scaled) # probability prediction
        drying_value = proba_predictions_new[0][-1].round(4)*100

        return JsonResponse({ 'loading_value': loading_pred, 'dyring_value': drying_value})
    
class CalenderingAPI(APIView):
    def post(self, request):
        print('calendering simulation')
        _body = json.loads(request.body.decode("utf-8"))
        ml_folder_path = "manufacturing/ml_models/"
        with open(ml_folder_path+"batwoman_calendering_ml_model_v3.pickle", 'rb') as f:
            calendering_thickness = pickle.load(f)
        with open(ml_folder_path+'batwoman_calendering_ml_model_post.pickle', 'rb') as f:
            calendering_thickness_post = pickle.load(f)
        input_values = []
        for i in _body:
            if i['value'] == 'No':
                input_values.append(0.)
            elif i['value'] == 'Yes':
                input_values.append(1.)
            else:
                input_values.append(float(i['value']))
        # loading prediction
        _inputs = np.array([[input_values[0], input_values[1], # loading, speed
                             input_values[2], input_values[3], input_values[4], # gap, pressure, temperature
                             ]]) 
        elec_thickness = calendering_thickness.predict(_inputs)[0].round(2)
        elec_thickness_post = calendering_thickness_post.predict(_inputs)[0].round(2)
        return JsonResponse({ 'elec_thickness': elec_thickness, 'elec_thickness_post': elec_thickness_post})

def replicate_drying_measurements_full(w_0, w_end, spacing, depth, time_minutes):
    """
    Simulates the drying process using calculated G3, G4, and k based on spacing and depth.

    Parameters:
        w_0 (float): Initial moisture content (kg/m³)
        w_end (float): Final moisture content (kg/m³)
        spacing (float): Spacing input (µm)
        depth (float): Depth input (µm)
        time_minutes (array-like): Time points in minutes

    Returns:
        DataFrame: Simulated drying values with time in hours, minutes, and moisture content.
    """
    # Calculate G3 and G4 from the formulas
    G3 = -0.000009 * (depth ** 2) + 0.0033 * depth - 0.1979
    G4 = 538.52 * (spacing ** -1.714)

    # Compute k
    k = G3 * G4 * 10

    # Time conversion
    time_minutes = np.array(time_minutes)
    time_hours = time_minutes / 60.0

    # Exponential drying model
    w = w_end + (w_0 - w_end) * np.exp(-k * time_minutes)

    return pd.DataFrame({
        "t_h": time_hours,
        "t_min": time_minutes,
        "w_kg_m3": w
    })

class DryingUDE(APIView):
    def post(self, request):
        print('dryingUDE')
        _body = json.loads(request.body.decode("utf-8"))
        w_0 = float(_body[0]['value'])
        w_end = float(_body[1]['value'])
        spacing = float(_body[2]['value'])  # µm
        depth = float(_body[3]['value'])  # µm
        time_range = np.arange(0, 100)  # 0 to 120 minutes
        final_simulation_output = replicate_drying_measurements_full(w_0, w_end, spacing, depth,time_range)
        return JsonResponse({
            't_h': final_simulation_output['t_h'].tolist(),
            't_min': final_simulation_output['t_min'].tolist(),
            'w_kg_m3': final_simulation_output['w_kg_m3'].tolist()
        })
    
def simulate_wetting(spacing_um: float, width_um: float, t_max: float = 25) -> pd.DataFrame:
    """
    Replicate the Excel model in Wetting_simple.xlsx → sheet “str”.

    Parameters
    ----------
    spacing_um : float
        Channel spacing (µm), cell B2.
    width_um : float
        Channel width (µm), cell B3.
    t_max : float, default 25
        End of the time-series (s). 25 s matches the workbook.

    Returns
    -------
    pandas.DataFrame
        Columns match Excel:
            • T_s    (G)  time [s]  
            • H_m    (H)  “raw” film thickness [m]  
            • dHdt_m_per_s (I)  dH/dt [m s⁻¹]  
            • dHdt_adj_m_per_s (J)  |dH/dt| after spacing correction [m s⁻¹]  
            • H_adj_m  (K)  integrated thickness [m]  
            • H_adj_cm (L)  H_adj_m converted to cm
    """
    # — physical constants (cells E3:E9) —
    mu, sigma, theta_deg, rho, g = 0.00063, 0.0288, 35.0, 1070.0, 9.81
    θ = math.radians(theta_deg)
    cosθ = math.cos(θ)

    # — coefficients derived from the two inputs —
    k1 = 0.0008 * spacing_um + 0.2664                              # cell E2
    r_width_um = 0.0135 * width_um**2 - 0.47 * width_um + 11.75    # cell E17
    r = r_width_um / 1e6                                           # cell E8 (m)

    # — piece-wise time grid (column G) —
    times, dts, t = [0.0], [], 0.0
    while t < t_max:
        dt = 0.01 if t < 0.1 else 0.1 if t < 1.0 else 0.5 if t < 20.0 else 1.0
        dts.append(dt)
        t = round(t + dt, 12)    # eliminate FP drift
        times.append(t)

    # — forward-Euler integration reproducing columns H-L —
    H_raw  = [0.001]             # initial H (row 3)
    H_adj  = [0.001]
    dHdt   = []
    dHdt_a = []

    for dt in dts:
        H = H_raw[-1]
        cap   = (2 * sigma * cosθ) / r
        grav  = rho * g * H
        dH    = (r**2 / (8 * mu * H)) * (cap - grav)          # column I
        dH_a  = dH * (1 - k1)                                 # column J
        dHdt.append(dH)
        dHdt_a.append(dH_a)
        H_raw.append(H + dt * dH)                             # column H
        H_adj.append(H_adj[-1] + dt * dH_a)                   # column K

    return pd.DataFrame(
        {
            "T_s":               times[:-1],
            "H_m":               H_raw[:-1],
            "dHdt_m_per_s":      dHdt,
            "dHdt_adj_m_per_s":  dHdt_a,
            "H_adj_m":           H_adj[:-1],
            "H_adj_cm":          np.array(H_adj[:-1]) * 100,
        }
    )

class WettingUDE(APIView):
    def post(self, request):
        print('dryingUDE')
        _body = json.loads(request.body.decode("utf-8"))
        pd.set_option("display.precision", 10)
        high_precision_df = simulate_wetting(float(_body[0]['value']), float(_body[1]['value']))
        # print('final_simulation_output',type(final_simulation_output),final_simulation_output)
        return JsonResponse({
            'T_s': high_precision_df['T_s'].tolist(),
            'H_m': high_precision_df['H_m'].tolist(),
            'dHdt_m_per_s': high_precision_df['dHdt_m_per_s'].tolist(),
            'dHdt_adj_m_per_s': high_precision_df['dHdt_adj_m_per_s'].tolist(),
            'H_adj_m': high_precision_df['H_adj_m'].tolist(),
            'H_adj_cm': high_precision_df['H_adj_cm'].tolist()
        })
    
class UDEPerformance(APIView):
    def post(self, request):
        _body = json.loads(request.body.decode("utf-8"))
        print('performance simulation')
        # print(type(_body),_body)
        spacing_pitch = {150:1.742, 200:1.562, 300:1.335}
        width = {10:1.431, 15:1.562, 20:1.652}
        depth = {50:1.346, 60:1.435, 70:1.51, 80:1.562, 90:1.594, 99:1.608}

        c1 = spacing_pitch[int(_body[0]['value'])]
        c2 = width[int(_body[1]['value'])]
        c3 = depth[int(_body[2]['value'])]
        x = 0.41005
        f = c1*c2*c3*x
        k = 2.42
        A = 175

        c_rate = np.arange(0, 3.1, 0.1)
        capacity_list = []
        for i in range(len(c_rate)):
            capacity_list.append(A/(1+(c_rate[i]/f)**k))
        return JsonResponse({'c_rate': list(c_rate), 'capacity_list': capacity_list})