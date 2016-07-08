var date = {};

date.reform = (date) => {
    date = date.split(" ")[0];
    return new Date(date);
}

date.checkInbetween = (date_start, date_middle, date_end) => {
    var inbetween = false;
    const date_start_ms  = date.reform(date_start).getTime();
    const date_middle_ms = date_middle.getTime();
    const date_end_ms    = date.reform(date_end).getTime();
    
    inbetween = (date_middle_ms >= date_start_ms && date_middle_ms <= date_end_ms);
        
    return inbetween;
}

date.checkInbetweenCurrentDate = (date_start, date_end) => {
    return date.checkInbetween(date_start, new Date(), date_end);
}