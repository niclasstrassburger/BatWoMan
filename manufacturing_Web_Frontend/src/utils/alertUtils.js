import Swal from 'sweetalert2'

export function failedRequest(e) {
    if (!e) {
        Swal.fire({
            icon: 'warning',
            title: 'Something went wrong...',
            html: 'Try again later.',
        })
        return
    }
    switch (e.code) {
        case 'ERR_NETWORK':
            Swal.fire({
                icon: 'warning',
                title: 'Could not connect with server',
                html: 'Try again later.',
            })
            break;
        default:
            Swal.fire({
                icon: 'warning',
                title: 'Something went wrong...',
                html: 'Try again later.<br>' + e.code,
            })
            break;
    }
}