export default function convertHourToMinutes(time: string) {
    // 8:30
    const [hour, minutes] = time.split(':').map(Number); /* Divide o tempo em horas e minutos e convert a string pra number */ 
    const timeInMinutes = (hour * 60) + minutes;
    
    return timeInMinutes;
}