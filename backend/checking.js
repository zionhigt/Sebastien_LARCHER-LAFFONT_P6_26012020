const npmCheck = require('npm-check') ;   
npmCheck()
  .then(currentState => {
  	const formatedArray = currentState.get('packages').map(package => {
  		const obj = {
  			name: package.moduleName,
  			upToDate: package.latest == package.installed,
  			used: !(package.unused)
  		}
  		return obj;
  	});
  	console.log(formatedArray);

  });
  