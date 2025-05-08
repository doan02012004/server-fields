const getPrice = (rangePrices, startTime,endTime) => {
    if (!startTime || !endTime ) return 0
    let price = 0
    for (const rangePrice of rangePrices) {
        if ( startTime > rangePrice.startTime && startTime < rangePrice.endTime || endTime > rangePrice.startTime && endTime < rangePrice.endTime ) {
            const fromInTime = Math.max(rangePrice.startTime, startTime)
            const toInTime = Math.min(rangePrice.endTime, endTime)
            const priceOfMinutes = rangePrice.price / 90
            const rangeTime = toInTime - fromInTime
            price += Math.floor((rangeTime < 0 ? 0: rangeTime ) * priceOfMinutes)
        }
    }
    return price
}

export default getPrice