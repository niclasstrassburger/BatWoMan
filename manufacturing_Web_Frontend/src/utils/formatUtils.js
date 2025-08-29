export function formatDate(date, withTime = true) {
    let format = { year: 'numeric', month: 'short', day: 'numeric' }
    if (withTime) format = { ...format, month: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }
    return date.toLocaleDateString('en-GB', format);
}

export function decodeQueryParams(query) {
    try {const jsonString = atob(query)
      const data = JSON.parse(jsonString)
      return data
    }
    catch {
      return null
    }
  }

export function encodeQueryParams(data) {
    const jsonString = JSON.stringify(data)
    const queryData = btoa(jsonString)
    return queryData
  }

export function copyToClipboard(text) {
  if (navigator.clipboard){
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Text copied to clipboard:', text);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
    return 'clipboard'
  } else {
    var link = document.createElement('a');
    link.href = "mailto:?subject=Proteo%20Data%20Analytics%20Tests&body=" + encodeURIComponent(text)
    link.click()
    return 'email'
  }
}