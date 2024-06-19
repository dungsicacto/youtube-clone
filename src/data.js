
export const API_KEY = 'AIzaSyCkEKel4AG5h610n7h5BvR4486MJ_LeAqM'

export const value_converter = (value) => {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`
    }
    else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`

    }
    else {
        return value
    }
}