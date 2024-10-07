// Code graciously donated by ChatGPT
function formatDateForTitle(date: Date): string {
    const dateOptions: Intl.DateTimeFormatOptions = {
        month: 'long',    // Full month name (e.g., 'October')
        day: 'numeric',   // Day of the month (e.g., '1')
        year: 'numeric'   // Year (e.g., '2024')
    };
    
    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',  // 2-digit hour (e.g., '03')
        minute: '2-digit',// 2-digit minute (e.g., '45')
        second: '2-digit',// 2-digit second (e.g., '12')
        hour12: true      // 12-hour format with AM/PM
    };
    
    const formattedDate: string = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime: string = date.toLocaleTimeString('en-US', timeOptions).replace(/:/g, '-');
    
    return `${formattedDate}, ${formattedTime}`;
}

function formatDateForDirectory(date: Date): string {
    const options = {
        month: 'numeric',    // Numeric month (e.g., "10")
        day: 'numeric',      // Numeric day (e.g., "5")
        year: 'numeric',     // Full year (e.g., "2024")
        hour: 'numeric',     // Numeric hour (e.g., "7")
        minute: '2-digit',   // Two-digit minute (e.g., "21")
        hour12: true         // 12-hour time format with AM/PM
    };
    
    const formattedDate = date.toLocaleString('en-US', options as any).replace(', ', ' ');
    
    return formattedDate;
}

function debounce<T extends Function>(cb: T, wait: number) {
    let h = 0;
    let callable = (...args: any) => {
        clearTimeout(h);
        h = setTimeout(() => cb(...args), wait);
    };
    return callable as any as T;
}
  

export { formatDateForTitle, formatDateForDirectory, debounce };  