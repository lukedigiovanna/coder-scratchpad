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
  
  
export { formatDateForTitle };  