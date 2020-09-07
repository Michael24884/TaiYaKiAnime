export default function isOnline() {
    if (typeof navigator.onLine !== 'undefined') {
        return navigator.onLine;
    }
    // always assume it's online
    return true;
}
