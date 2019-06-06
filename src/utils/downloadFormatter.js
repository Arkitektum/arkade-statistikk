export function removeDuplicate(a, b) {
    if (a.indexOf(b) < 0) {
        a.push(b)
    }
    return a
}

export const groupData = (data, dateFormatter) => {
    return data.reduce((date, current) => {
        if (date.indexOf(dateFormatter(current.day)) < 0) {
            date.push(dateFormatter(current.day))
        }
        return date
    }, [])
        .map((date) => {
            return {
                date: date,
                downloads: data.filter(el => dateFormatter(el.day) === date)
                    .map(el => el.downloads)
                    .reduce((total, download) => total + download)
            }
        })
        .map(element => element.downloads)
}
