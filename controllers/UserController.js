class UserController{

	constructor(formIdCreate,formIdUpdate,tableId){
		this.formEl = document.getElementById(formIdCreate);
		this.formUpdateEl = document.getElementById(formIdUpdate);
		this.tableEl = document.getElementById(tableId);
		this.onSubmit();
		this.onEdit();
		this.selectAll();
	}

	onEdit(){
		/*Localiza o elemento que tenha a classe btn-cancel dentro do elemento de id
		  box-user-update.*/ 
		document.querySelector("#box-user-update .btn-cancel").addEventListener("click",e=>{
			this.showPanelCreate();
		});
		this.formUpdateEl.addEventListener("submit",event=>{
			event.preventDefault();
			let btn = this.formUpdateEl.querySelector("[type=submit]");
			btn.disabled = true;
			let values = this.getValues(this.formUpdateEl);
			//Obtêm o índice da linha da tabela armazenada no DataSet trIndex.
			let index = this.formUpdateEl.dataset.trIndex;
			//Recupera a linha da tabela que esteja na posição index.
			let tr = this.tableEl.rows[index];
			let userOld = JSON.parse(tr.dataset.user);
			/*Sobrescreve os campos em branco dos objetos partindo
			  da direita para a esquerda.*/
			let result = Object.assign({},userOld,values);
            this.getPhoto(this.formUpdateEl).then(
				//Parâmetro resolve
				/*Sempre que usar this evitar criar funções com function, 
				  pois elas mudam o escopo.*/
				(content)=>{
					/*Se o usuário não tiver selecionado uma nova foto,
					  mantém a anterior.*/ 
					if(!values._photo){ 
						result._photo = userOld._photo;
					}else{
						result._photo = content;
					}
					let user = new User();
					user.loadFromJSON(result);
					user.save();
					this.getTr(user,tr); 
            		this.updateCount();
					this.formUpdateEl.reset();
					btn.disabled = false;
					this.showPanelCreate();
				},
				//Parâmentro reject
				(e)=>{
					//Exibe o erro no console do navegador
					console.error(e);
				}
			);	
		});
	}

	onSubmit(){
		this.formEl.addEventListener("submit",event=>{
			//Cancela o evento padrão do elemento no caso o submit
			//Ideal para Single Page Aplication (SPA)
			event.preventDefault();
			//Pesquisa pelo botão submit dentro do formulário
			let btn = this.formEl.querySelector("[type=submit]");
			//Desabilita o botão
			btn.disabled = true;
			let values = this.getValues(this.formEl);
			//Caso values seja falso cancela o evento.
			if(!values) return false;
			//Invoca a promise
			this.getPhoto(this.formEl).then(
				//Parâmetro resolve
				/*Sempre que usar this evitar criar funções com function, 
				  pois elas mudam o escopo.*/
				(content)=>{
					values.photo = content;
					values.save();
					this.addLine(values);
					//Limpa os campos do formulário
					this.formEl.reset();
					//Habilita o botão novamente
					btn.disabled = false;
				},
				//Parâmentro reject
				(e)=>{
					//Exibe o erro no console do navegador
					console.error(e);
				}
			);	
		});
	}

	getPhoto(formEl){
		/*Define uma promessa para uma ação assíncrona (no caso o carregamento da imagem). 
		  Se tudo der certo, executa a ação especificada pelo parâmetro resolve, senão 
		  executa a ação do parâmetro reject.*/
		return new Promise((resolve,reject)=>{
			let fileReader = new FileReader();
			let elements = [...formEl.elements].filter(item=>{
				if(item.name === 'photo'){
					return item;
				}
			});
			let file = elements[0].files[0];
			//Callback a ser executado quando a imagem terminar de ser carregada. 
			fileReader.onload = () =>{
				//Retorna a imagem no formato Base64
				resolve(fileReader.result);
			};
			//Callback que é disparado quando ocorre um erro no processo de leitura do arquivo.
			fileReader.onError = () =>{
				reject(e);
			};
			if(file)
				fileReader.readAsDataURL(file);
			else
				resolve("dist/img/boxed-bg.jpg");
		});
	}

	getValues(formEl){		
		let user = {};
		let isValid = true;
		/*Os cochetes definem o elemento como um Array e a reticências (Spread) 
		  define que sejam pegos todos os elementos sem que precise especificar
		  o índice.*/ 
		[...formEl.elements].forEach(function(field, index){
			//Verifica se o campo está dentro do vetor e se o conteúdo dele é vazio.
			if(["name","email","password"].indexOf(field.name) > -1 && !field.value){
				/* Acessa o elemento pai do campo e adiciona as classes  
				   dele a propriedade CSS has-error. */
				field.parentElement.classList.add("has-error");
				isValid = false;
			}
			if(field.name == "gender"){
				if(field.checked)
					user[field.name] = field.value;
			}else if(field.name == "admin"){
				//Captura um booleano indicando se a checkbox está checada ou não.
				user[field.name] = field.checked;
			}else{
					/*Define a chave do objeto user como sendo o nome do campo
					e atribui o valor como propriedade da chave. */
					user[field.name] = field.value;
			}
		});
		//Se o formulário não estiver válido interrompe a execução do método.
		if(!isValid){
			return false;
		}
		return new User(user.name,
			user.gender,
			user.birth,
			user.country,
			user.email,
			user.password,
			user.photo,
			user.admin);
	}

	selectAll(){
		let users = User.getUsersStorage();
		users.forEach(dataUser=>{
			let user = new User();
			user.loadFromJSON(dataUser);
			this.addLine(user);
		});
	}

	addLine(dataUser){
		let tr = this.getTr(dataUser);		     
        //Adiciona um elemento filho a outro sem substituir o conteúdo já existente.
        this.tableEl.appendChild(tr);
        this.updateCount();
	}

	/*Define o valor padrão de tr como sendo null,
	  tornando a sua utilização facultativa, de modo que 
	  não sou obrigado a passar esse parâmetro.*/
	getTr(dataUser, tr = null){
		//Se não existir a linha cria uma.
		if(tr===null) tr = document.createElement("tr");
		/* A API dataset permite recuperar um valor como um objeto 
		   e o método stringify converte seu conteúdo para String JSON,
		   em um processo conhecido como Serialização. */
		tr.dataset.user = JSON.stringify(dataUser);
		tr.innerHTML = `<tr>
                    <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                    <td>${dataUser.name}</td>
                    <td>${dataUser.email}</td>
                    <td>${(dataUser.admin)?'Sim':'Não'}</td>
                    <td>${Utils.dateFormat(dataUser.register)}</td>
                    <td>
                      <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                      <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
                    </td>
                  </tr>`;
        this.addEventsTr(tr);
        return tr;		
	}

	addEventsTr(tr){
		//Adiciona o evento do botão deletar
		tr.querySelector(".btn-delete").addEventListener("click",e=>{
			//Abre uma janela de confirmação e retorna um booleano.
			if(confirm("Deseja realmente excluir ?")){
				let user = new User();
				user.loadFromJSON(JSON.parse(tr.dataset.user));
				user.remove();
				//Remove a linha da tabela.
				tr.remove();
				this.updateCount();
			}
		});
		//Adiciona o evento do botão editar
		tr.querySelector(".btn-edit").addEventListener("click",e=>{
        	let json = JSON.parse(tr.dataset.user);
        	//Recupera o índice da linha começando a contagem de 0.
        	this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;
        	//O laço For in percorre cada elemento do JSON.
        	for(name in json){
        		/*Seleciona o campo cujo name seja igual ao valor do Json,
        		  utilizando o replace para tirar o underline do elemento.*/
        		let field = this.formUpdateEl.querySelector("[name = "+name.replace("_","")+"]");
        		//Verifica se encontrou o campo
        		if(field){
        			switch(field.type){
        				/*Como o campo arquivo não possui value o continue 
        			  	  pula para a próxima interação.*/
        				case 'file':
        					continue;
        				break;
        				/*No caso do componente Radio seleciona somente o campo 
        				  que tenha value igual ao do JSON.*/
        				case 'radio':
        					field = this.formUpdateEl.querySelector("[name = "+name.replace("_","")+"][value="+json[name]+"]");
        					field.checked = true;
        				break;
        				//Verifica o valor da chave do JSON para marcar ou não a checkbox.
        				case 'checkbox':
        					field.checked = json[name];
        				break;
        				default:
        					/*O valor do campo selecionado recebe a propriedade relacionada 
        			  		  com a chave name da presente interação.*/
        					field.value = json[name];
        			}
        		}
        	}
        	this.formUpdateEl.querySelector(".photo").src = json._photo;
        	this.showPanelUpdate();
        });
	}

	showPanelCreate(){
       	document.querySelector("#box-user-create").style.display = "block";
       	document.querySelector("#box-user-update").style.display = "none";
	}

	showPanelUpdate(){
	   	//Oculta o formulário de inserção e mostra o de alteração.
       	document.querySelector("#box-user-create").style.display = "none";
       	document.querySelector("#box-user-update").style.display = "block";
	}

	updateCount(){
		let numberUsers = 0;
		let numberAdmin = 0;
		[...this.tableEl.children].forEach(tr=>{
			numberUsers++;
			//O método parse transforma a String JSON em um objeto JSON manipulável.
			let user = JSON.parse(tr.dataset.user);
			if(user._admin) numberAdmin++;
		});
		document.querySelector("#number-users").innerHTML = numberUsers;
		document.querySelector("#number-users-admin").innerHTML = numberAdmin;
	}

}
