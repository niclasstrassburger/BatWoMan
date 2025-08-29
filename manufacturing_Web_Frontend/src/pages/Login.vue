<template>
   <v-container fluid fill-height style="height: 80vh;" class="d-flex align-center">
      <v-row class="justify-center">
         <v-col cols="6" sm="8" class="d-flex justify-center">
            <v-card class="elevation-12" width="100%" min-width="350px" max-width="700px">
               <v-toolbar dark color="greenAppBar" class="py-0">
                  <v-toolbar-title>
                     <div class="d-flex justify-center">
                        <v-img alt="CIDETEC logo" max-width="80px" class="shrink mr-2" src="@/assets/UDE-logo-claim.svg"
                           transition="scale-transition" />
                        <v-img alt="batwoman logo" max-width="60px" class="shrink mr-2" src="@/assets/Logo_square_BatWoMan_transparent.png"
                           transition="scale-transition"  style='margin-left:2%;'/>
                        <v-img alt="CIDETEC logo" max-width="100px" class="shrink mr-2" src="@/assets/logoCidetec.png"
                           transition="scale-transition" style='margin-left:2%;'/>
                     </div>
                  </v-toolbar-title>
               </v-toolbar>
               <v-card-text class="text-center">
                  <v-form ref="form" @submit.prevent="login()">
                     <v-text-field v-model="user.username" label="User" type="text" required variant="outlined"
                        class="mb-3" />
                     <v-text-field v-model="user.password" label="Password" type="password" autocomplete="on" required
                        variant="outlined" />
                     <v-btn type="submit" class="mt-4" color="greenAppBar" :loading="logging">Login</v-btn>
                  </v-form>
                  <div class="d-flex justify-end mt-4" style='margin-bottom:0%; margin-right:2%;'>
                     <v-btn type="button" color="blue" variant="plain" density="compact" @click="goToRegister" style="margin-top:-7%;"> Click here to register </v-btn>
                  </div>
               </v-card-text>
            </v-card>
         </v-col>
      </v-row>
   </v-container>
</template>

<script>
import { mapActions } from 'pinia'
import { useAppStore } from '@/stores/app';

import Swal from 'sweetalert2'
export default {
   name: "LoginPage",
   data() {
      return {
         user: { username: '', password: '' },
         message: "",
         logging: false,
      };
   },
   computed: {

   },
   methods: {
      ...mapActions(useAppStore, ['updateUser', 'fetchUserPreferences']),
      login() {
         this.logging = true
         this.$axiosProteoDA.post('login/', this.user)
         // this.$axiosProteoDA.post('http://192.168.104.61:8001/login/', this.user)
            .then(res => {
               localStorage.setItem('token', res.data.token)
               localStorage.setItem('groups', res.data.groups)
               localStorage.setItem('user_id', res.data.user_id)
               localStorage.setItem('username', this.user.username)
               this.updateUser()
               this.$router.push('/ManufacturingHomepage')
            })
            .catch(e => {
               console.log(e);
               if (e.response !== undefined) {
                  if (e.response.status == 400) {
                     Swal.fire({
                        icon: 'error',
                        title: 'Oops!',
                        text: 'No valid credentials',
                     })
                     this.user.username = ''
                     this.user.password = ''
                  } else {
                     this.message = e.response.data
                  }
               } else {
                  this.message = 'Connection failed'
               }
            })
            .finally(() => this.logging = false)
      },
      goToRegister() {
         this.$router.push('/Register')
      }
   },
};
</script>