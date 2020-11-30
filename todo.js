    //HTML elementlerine ulaşma
    var taskForm=document.querySelector("#todo-form");
    var taskInput= document.querySelector("#todo");
    var taskList = document.querySelector(".list-group");
    var firstCardBody = document.querySelectorAll(".card-body")[0];
    var secondCardBody = document.querySelectorAll(".card-body")[1];
    var filter = document.querySelector("#filter");
    var clear = document.querySelector("#clearTasks");

    eventListeners();

    function eventListeners(){ //Tüm olay eklemeleri burada yapılacak.
        taskForm.addEventListener("submit",addTask);
        document.addEventListener("DOMContentLoaded",loadAllTasksToUI);
        secondCardBody.addEventListener("click",deleteTask);
        filter.addEventListener("keyup",filterTasks);
        clear.addEventListener("click",clearAllTasks);
    }

    function clearAllTasks(){
        console.log(taskList.firstElementChild); //Listenin ilk child->ilk li elemanı.
        //Tüm li elemanları silinince firstElementChild null döner.->
        if(confirm("Tüm görevleri silmek istediğinizden emin misiniz?")){
            //Arayüzden silme

            //Onay alma uyarısı verilir. Tamam tıklanırsa true döner. if çalışır
            while( taskList.firstElementChild != null){ //Child null olmadığı sürece sil.
                taskList.removeChild(taskList.firstElementChild); 
            }

            //Local Storage'dan silme
            localStorage.removeItem("tasks"); //Görevler dizisinin key'ini silersem hepsi silinir.

        }

    }
    
    function filterTasks(e){
        var filtered = e.target.value; //filtrelenecek kelimenin yazıldığı input alanındaki değer.
        var listItems=document.querySelectorAll(".list-group-item"); //Tüm görev listesini al.
        listItems.forEach(function(item){
            var itemContent=item.textContent; //Listedeki görevin içeriğini aldık.
            if(itemContent.indexOf(filtered) === -1){ //Görev içinde filtreyi aradık
                //-1 döndüğüne göre filtered kelime içerikte yok.
                //O zaman bu list itemi görünmez yap
                item.setAttribute("style","display:none !important");
            }
            else{
                item.setAttribute("style","display:block");
            }
        })
    }

     //Local Storage'daki görevler listesini array olarak alma
     function getTasksFromStorage(){
        var tasks;

        if( localStorage.getItem("tasks") === null){
            tasks = [];
        }
        else{
            tasks = JSON.parse(localStorage.getItem("tasks"));
        }

        return tasks;
    }


    function deleteTask(e){
        if( e.target.className === "fa fa-remove"){
            var text=e.target.parentElement.parentElement;
            deleteTaskFromStorage(text.textContent);            
            e.target.parentElement.parentElement.remove();
            //Parametre olarak silecegim elemanın textContenti görev adını verir.
            showAlert("success","Görev başarıyla silindi");
        }
    }

    function deleteTaskFromStorage(dltTask){
        var tasks = getTasksFromStorage();
        tasks.forEach(function(task,index){
            if(task === dltTask){
               //console.log(task);
               tasks.splice(index,1); //indexden sonra 1 eleman sil.
                                    // index silinecek elemanın indexi.
            }
        });
        localStorage.setItem("tasks",JSON.stringify(tasks));
    }

    function addTask(e){
        var newTask = taskInput.value;

        //Görev alanı boş bırakıldıysa eklemesin.Uyarı versin
        if(newTask === ""){
            showAlert("danger","Lütfen bir görev giriniz!");
        }
        else if(ifNotIncludes(newTask)){
            addTaskToStorage(newTask);
            addTaskToUI(newTask);
            showAlert("success","Görev başarıyla eklendi");
        }
        else{

        }

    e.preventDefault();
    }

    //Sayfa her yüklendiğinde tüm görevler listelensin.
    function loadAllTasksToUI(){
        var tasks = getTasksFromStorage();

        tasks.forEach( function(task){
            addTaskToUI(task); //Diziyi gezerek içindeki her task'ı listeleyecek.
        })
    }

    function ifNotIncludes(newTask){
        var listItems=document.querySelectorAll(".list-group-item");
        var counter=0;
        listItems.forEach(function(item){
            if(newTask.localeCompare(item) === 0){
                counter++;
            }   
        });

        if(counter === 0){
            return true;
        }
    }

   

    //Görevi Local Storage'a ekleme
    function addTaskToStorage(newTask){
        //LocalStorage'daki mevcut tasks dizisini alıp,yeni task'ı ona ekledik ve
        //LS'daki diziyi güncelledik.
        var tasks =  getTasksFromStorage();
        tasks.push(newTask);
        localStorage.setItem("tasks",JSON.stringify(tasks));
    }

    //List elemanı oluşturma ve listeye ekleme
    function addTaskToUI(newTask){
        var listItem = document.createElement("li");
        listItem.className="list-group-item d-flex justify-content-between";
        //Link elemanı oluşturma
        var link = document.createElement("a");
        link.href="#";
        link.className="delete-item";
        var dlt=document.createElement("i");
        link.innerHTML="<i class = 'fa fa-remove'> </i>";

        listItem.appendChild(document.createTextNode(newTask));
        listItem.appendChild(link);

        //Liste elemanını listeye dahil etme
        taskList.appendChild(listItem);
    taskInput.value="";

    }

    function showAlert(type,message){
        var alert = document.createElement("div");
        alert.className= "alert alert-"+type;
        alert.textContent=message;
        
        firstCardBody.appendChild(alert); //Uyarı kutusunu birinci kart bodysinin altına ekleme

        //Uyarı mesajı 1 sn görünsün,daha sonra yok olsun.
        setTimeout(function(){
            alert.remove();
        },1000);

    }

