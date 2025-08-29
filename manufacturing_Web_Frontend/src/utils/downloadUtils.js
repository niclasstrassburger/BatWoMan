import XLSX from 'xlsx';

export function exportToExcel(data, fileName = 'data.xlsx') {
    const wb = XLSX.utils.book_new();
    Object.keys(data).forEach((cell, idx) => {
        const wsData = []
        const dataCell = data[cell]
        const columns = Object.keys(dataCell)
        wsData.push(columns)
        let maxRows = columns.reduce((maxR, col) => {
            if (dataCell[col].length > maxR) return dataCell[col].length
            else return maxR
        }, 0)
        for (let i = 0; i < maxRows; i++) {
            const rowData = columns.map(col => dataCell[col][i] != undefined ? dataCell[col][i] : '')
            wsData.push(rowData)
        }
        const ws = XLSX.utils.aoa_to_sheet(wsData)
        const sheetIndex = (idx < 10 ? "0" + idx : idx.toString())
        const sheetName = cell.slice(0, 26) + '#' + sheetIndex
        XLSX.utils.book_append_sheet(wb, ws, sheetName)
    })

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    // const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
    // const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    download(
        excelBuffer,
        fileName,
        { contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' }
    )
    // const url = URL.createObjectURL(blob)
    // const link = document.createElement('a')
    // link.href = url
    // link.download = fileName
    // // link.style.visibility = 'hidden';
    // document.body.appendChild(link)
    // link.click()
    // document.body.removeChild(link)
}

export function download(content, fileName, contentType) {
    const link = document.createElement("a")
    const file = new Blob([content], { type: contentType })
    link.href = URL.createObjectURL(file)
    link.download = fileName
    link.click()
}