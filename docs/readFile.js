(function(){
    readText(openFile());
    
    function openFile(){
	var reader;
	return new Promise(function(resolve, reject){
	    var xhr = new XMLHttpRequest();
	    xhr.responseType = "text";
	    xhr.addEventListener("load", function(){
		resolve(xhr.response);
	    });
	    xhr.addEventListener("error", function(){
		console.log("Error occared");
		reject();
	    });
	    xhr.open('GET', "https://mel225.github.io/ChuniCalc/ChuniNotesDataTable.txt", true);
	    xhr.send("");
	}).catch((e)=>{
	    console.log(e);
	});
    };

    function readText(promise){

	return promise.then(function(text){
	    alert(text);
	});
    };
			   
    
	
})(document)
 
