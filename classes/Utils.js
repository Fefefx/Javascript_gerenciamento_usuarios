class Utils{
	//A palavra static define um método estático
	static dateFormat(dt){
		//Retorna a data no formato DD/MM/YYYY hh:mm
		return dt.getDate()+'/'+(dt.getMonth()+1)+'/'+dt.getFullYear()+' '+dt.getHours()+':'+dt.getMinutes();
	}

}