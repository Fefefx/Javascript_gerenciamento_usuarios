/*var name = document.querySelector("#exampleInputName");
//Traga todos os elementos do formulário que tenham nome igual a gender e estejam checados.
var gender = document.querySelectorAll("#form-user-create [name=gender]:checked");
var birth = document.querySelector("#exampleInputBirth");
var country = document.querySelector("#exampleInputCountry");
var email = document.querySelector("#exampleInputEmail");
var password = document.querySelector("#exampleInputPassword");
var photo = document.querySelector("#exampleInputFile");
var admin = document.querySelector("#exampleInputAdmin");
*/
//Seleciona todos os campos do formulário que possuem atributo name
//var fields = document.querySelectorAll("#form-user-create [name]");

/*document.querySelectorAll("button").forEach(function(){
	this.addEventListener("click",function(){
		console.log("Clicou !");
	});
});*/

let userController = new UserController("form-user-create","form-user-update","table-users");



