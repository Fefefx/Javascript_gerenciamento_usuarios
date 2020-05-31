class User{
	constructor(name,gender,birth,country,email,password,photo,admin){
		this._id;
		this._name = name;
		this._gender = gender;
		this._birth = birth;
		this._country = country;
		this._email = email;
		this._password = password;
		this._photo = photo;
		this._admin = admin;
		this._register = new Date();
	}

	get id(){
		return this._id;
	}

	get name(){
		return this._name;
	}

	get gender(){
		return this._gender;
	}

	get birth(){
		return this._birth;
	}

	get country(){
		return this._country;
	}

	get email(){
		return this._email;
	}

	get password(){
		return this._password;
	}

	get photo(){
		return this._photo;
	}

	set photo(value){
		this._photo = value;
	}

	get admin(){
		return this._admin;
	}

	get register(){
		return this._register;
	}

	loadFromJSON(json){
		for(name in json){
			switch(name){
				case '_register':
					//Cria uma instância de Date a partir da chave do JSON 
					this[name] = new Date(json[name]);
				break;
				default:
					//Exemplo: this[_email] = json[_email]
					this[name] = json[name];
			}
		}
	}

	static getUsersStorage(){
		let users = [];
		/*Se existir uma string com os dados dos usuários
		  carrega os mesmos no vetor.*/
		/*if(sessionStorage.getItem("users")){
			users = JSON.parse(sessionStorage.getItem("users"));
		}*/
		if(localStorage.getItem("users")){
			users = JSON.parse(localStorage.getItem("users"));
		}
		return users;
	}

	getNewID(){
		let usersID = parseInt(localStorage.getItem("usersID"));
		/*Verifica se existe o atributo id no escopo da aplicação.
		  Caso não exista, define esse atributo iniciando de 0.*/
		if(!usersID) usersID = 0;
		usersID++;
		localStorage.setItem("usersID",usersID);
		return usersID;
	}

	save(){
		let users = User.getUsersStorage();
		if(this.id > 0){
			/*Map localiza um elemento em um vetor 
			  e possibilita sobrescrevê-lo.*/
			users.map(u=>{
				if(u._id == this.id){
					//Mescla as alterações no objeto u.
					Object.assign(u,this);
				}
				return u;
			});
		}else{
			this._id = this.getNewID();
			users.push(this);
			/*Armazena uma informação na sessão do navegador,
			  tornando-a disponível enquanto o usuário navegar
			  pelo site.Parâmetros são CHAVE e VALOR.*/ 
			//sessionStorage.setItem("users",JSON.stringify(users));
			/*Armazena a informação no navegador, tornando-a
			  disponível até o usuário apagar o cache do mesmo.
			  CUIDADO: A infomação NÃO é encriptada.*/
		}
		localStorage.setItem("users",JSON.stringify(users)); 
	}

	remove(){
		let users = User.getUsersStorage();
		/*Varre registro por registro dos usuários,
		  até encontrar no localStorage o usuário que
		  pretende-se remover.*/
		users.forEach((userData,index)=>{
			if(this._id == userData._id){
				/*A partir de uma determinada posição
				  remove uma quantidade específica de
				  elementos do vetor.*/
				users.splice(index,1);
			}
		});
		localStorage.setItem("users",JSON.stringify(users)); 
	}

}