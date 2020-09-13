/*----------------------- VARIABLES --------------------*/

var selectCourse    = document.getElementById('selectCourse'),
    selectDate      = document.getElementById('selectDate'),
    selectTime      = document.getElementById('selectTime'),
    responseMessage = document.getElementById('responseMessage'),
    successMessage  = document.getElementById('successMessage'),
    myForm          = document.getElementById('myForm'),
    submitButton    = document.getElementById('submitButton'),
    loading         = document.getElementById('loading');


/*------------------------------------------- *********** --------------------------------------------------*/
/*------------------------------------------- FUNCTIONS ----------------------------------------------------*/
/*------------------------------------------- *********** --------------------------------------------------*/


/*----------------------- get time --------------------*/
function getTime(hrs,min,sec){
    let am_pm = (hrs>=12)?'PM':'AM'
    if(hrs>12)
        hrs = hrs%12;
    if(hrs>=0 && hrs<10){
        hrs = hrs.toString();
        hrs = '0'+hrs;
    }
    if(min>=0 && min<10){
        min = min.toString();
        min = '0'+min;              
    }
    if(sec>=0 && sec<10){
        sec = sec.toString();
        sec = '0'+sec;              
    }
    let str = hrs+':'+min+':'+sec+' '+am_pm;
    return str;
}

/*----------------------- fetch Data --------------------*/

function fetchData(selector,typeSelect='Date'){
    let url='https://script.google.com/macros/s/AKfycbzJ8Nn2ytbGO8QOkGU1kfU9q50RjDHje4Ysphyesyh-osS76wep/exec';
        fetch(url)
        .then(response => response.json())
        .then(data => {
            /* today: today's date */
            let today = new Date();
            
            for(let i=0;i<data.length;i++){
                if(data[i].course_name===selectCourse.value){
                    let slots = data[i].slots;
                    let allPossibleDates=new Set(); // set containing different values
                    let newDateAfter7Days = new Date(); // show dates only from today till next week same day
                    newDateAfter7Days.setDate(newDateAfter7Days.getDate()+7); // add 7 days to it
                    
                    /* loop through all slots */
                    slots.forEach(newSlot=>{
                        let possibleDate = new Date(newSlot.slot*1); // convert UNIX time stamp to Date
                        if(possibleDate>=today && possibleDate<newDateAfter7Days){
                            console.log();
                            let date = possibleDate.getDate()+'-'+possibleDate.getMonth()+'-'+possibleDate.getFullYear();
                            let time = new Date();
                            time.setHours(time.getHours()+4); // add 4 hours to current time
                            
                                // append selectDate Option
                            if(typeSelect==='Date'){
                                allPossibleDates.add(date); 
                            }
                            else{ // append selectTime Option
                                if(date.toString()===selectDate.value){
                                    // 4hrs from now
                                    if(possibleDate>time){
                                        let hrs = Number(possibleDate.getHours()),
                                            min = possibleDate.getMinutes(),
                                            sec = possibleDate.getSeconds();
                                        let from = getTime(hrs,min,sec);
                                        let to   = getTime(hrs+1,min,sec);
                                        allPossibleDates.add(from+' - '+to);
                                    }
                                }      
                            }
                        }
                    });
                    
                    addNewOption(allPossibleDates,selector,typeSelect);
                    selector.disabled = false;
                    break;
                }
            }
        });
}


/*----------------------- add options --------------------*/

function addNewOption(allPossibleDates,selector,typeSelect='Date'){
    selector.innerHTML = '';
    if(allPossibleDates.length<1){

        let option = document.createElement('option');
        option.value="";
        option.innerText = `Select ${typeSelect}`;
        selector.appendChild(option);

        responseMessage.style.display="block";
        responseMessage.style.textAlign="center";
        responseMessage.innerText='No slots available at the moment'
    }else{
        let option = document.createElement('option');
        option.value="";
        option.innerText = `Select ${typeSelect}`;
        selector.appendChild(option);
        allPossibleDates.forEach( (possibleDate)=>{

            let option = document.createElement('option');
            option.value=possibleDate;
            option.innerText = possibleDate;

            selector.appendChild(option);
        });
    }
    // reset loading
    loading.style.display="none";
}


/*----------------------- reset values --------------------*/
function resetValues(typeSelect='Time'){
    responseMessage.style.display="none";
    responseMessage.innerText='';
    selectTime.innerHTML = '';
    let option = document.createElement('option');
    option.value="";
    option.innerText = 'Select Time';
    selectTime.appendChild(option);
    selectTime.disabled = true;

    if(typeSelect=='Date'){
        selectDate.innerHTML = '';
        let option = document.createElement('option');
        option.value="";
        option.innerText = 'Select Date';
        selectDate.appendChild(option);
        selectDate.disabled = true;
    }
}

/*----------------------- course select --------------------*/

selectCourse.addEventListener('change',()=>{
    resetValues('Date');
    // set loading
    loading.style.display="block";
    if(selectCourse.value!=""){
        fetchData(selectDate,'Date');
    }
    else{
        selectDate.disabled = true;
        selectTime.disabled = true;      
    }
});


/*----------------------- date select --------------------*/

selectDate.addEventListener('change',()=>{
    resetValues('Time');
    // set loading
    loading.style.display="block";
    if(selectDate.value!=""){
        fetchData(selectTime,'Time');
    } else{
        selectTime.disabled = true;     
    }
});

/*----------------------- form validation --------------------*/

function onSubmit(){
    myForm.reset();
    return false;
}