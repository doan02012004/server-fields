

export const dayInWeek =[
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
]

export const isSameDay = (selectedDate,formatDate) => {
    let check = false
    if(!selectedDate){
        return check
    }
    if(Number(formatDate.split('-')[0]) === Number(selectedDate.split('-')[0]) && Number(formatDate.split('-')[1]) === Number(selectedDate.split('-')[1]) ){
        check = true
    }
   return check
}

export const generateTextByMinutes = (minutes) => {
    const textHours = Math.floor(minutes / 60);
    let textMinutes
    if (minutes > 0) {
        textMinutes = minutes - textHours * 60
    } else {
        textMinutes = 0
    }
    return `${textHours.toString().padStart(2, '0')}h${textMinutes.toString().padStart(2, '0')}`
}

export const sortObject = (obj) => {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
        sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
        // sorted[key] = obj[key];
    });
    return sorted;
};

  export const generateBookingCode = () => {
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '') 
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase() 
    return `BOOK-${dateStr}-${randomStr}` 
  }

export function formatDateToCustomString(date) {
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const dd = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
}

export const getMonthRange = (month, year) => {
    const now = new Date();
    const m = parseInt(month) || now.getMonth() + 1;
    const y = parseInt(year) || now.getFullYear();
  
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 1);
    return { start, end };
  };

