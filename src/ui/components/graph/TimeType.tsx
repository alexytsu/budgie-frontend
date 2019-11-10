interface TimeType {
    generateDates();
    generateDatesToString();
    generateData(transactions, graphType, budget);
}

export class Week implements TimeType {

    generateDates() {
        let days = []
        let now = new Date()
        let day = now.getDay()
        let date = now.getDate()
        let start = new Date(now)
        start.setDate(date - day)
        start.setHours(0, 0, 0, 0)

        let i = 0
        for (i=0; i < 7; i++) {
            start.setDate(start.getDate()+1)
            let push = new Date(start)
            days.push(push)
        }

        days.sort((a,b) => {
            if (a.date < b.date) {
                return 1
            } else {
                return -1
            }
        })

        return days
    }

    generateDatesToString() {
        let days = this.generateDates()
        let dayString = []
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        days.forEach((date) => {
            dayString.push(dayNames[date.getDay()])
        })
        return dayString

    }

    generateData(transactions, graphType, budget) {
        let days = this.generateDates()
        let data = []
        if (graphType.isBalance()) {
            return graphType.calculateBalance(transactions, days, budget)
        } else {
            days.map((date) => {
                let tmpValue = 0;
                transactions.map((trans) => {
                    if (
                    new Date(trans.date).getDate() === date.getDate() &&
                    new Date(trans.date).getMonth() === date.getMonth() &&
                    new Date(trans.date).getFullYear() === date.getFullYear()){
                        tmpValue += Number(graphType.generateData(trans, budget))
                    }

                })
                data.push(tmpValue)
            })
            return data
        }
    }
}

export class Month implements TimeType {
    generateDates() {
        let days = []
        let now = new Date()
        let start = new Date(now.getFullYear(), now.getMonth(), 1)
        let month = now.getMonth()

        while (start.getMonth() === month) {
            days.push(new Date(start))
            start.setDate(start.getDate() + 1)
        }

        return days
    }

    generateDatesToString() {
        let days = this.generateDates()
        let dayString = []
        days.forEach((date) => {
            dayString.push(date.getDate())
        })
        return dayString
    }

    generateData(transactions, graphType, budget) {
        let days = this.generateDates()
        let data = []

        if (graphType.isBalance()) {
            return graphType.calculateBalance(transactions, days, budget)
        } else {
            days.map((date) => {
                let tmpValue = 0;
                transactions.map((trans) => {
                    if (
                    new Date(trans.date).getDate() === date.getDate() &&
                    new Date(trans.date).getMonth() === date.getMonth() &&
                    new Date(trans.date).getFullYear() === date.getFullYear()){
                        tmpValue += Number(graphType.generateData(trans))
                    }
                })
                data.push(tmpValue)
            })
        }
        return data
    }
}

export class Year implements TimeType {
    generateDates() {
        let months = []
        let now = new Date()
        let i = 0
        for (i=0; i < 12; i++) {
            months.push(new Date(now.getFullYear(), i, 1))
        }

        return months
    }

    generateDatesToString() {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        let months = this.generateDates()
        let monthString = []
        months.forEach((date) => {
            monthString.push(monthNames[date.getMonth()])
        })
        return monthString
    }

    generateData(transactions, graphType, budget) {
        let months = this.generateDates()
        let data = []

        if (graphType.isBalance()) {
            return graphType.calculateBalance(transactions, months, budget)
        } else {
            months.map((date) => {
                let tmpValue = 0
                transactions.map((trans) => {
                    if (
                    new Date(trans.date).getMonth() === date.getMonth() &&
                    new Date(trans.date).getFullYear() === date.getFullYear()){
                        tmpValue += graphType.generateData(trans)
                    }
                })
                data.push(tmpValue)
            })
        }
        
        return data
    }
}


