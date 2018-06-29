(function(){
    alert(openFile());
    
    function openFile(){
	var reader;
	return new promise(function(resolve, reject){
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
    
	
})(document)
 
