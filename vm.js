function VM() {
	this.memory = [];
	this.registers = [];
	this.stack = [];
	this.fifteenMax = 32768;	
	this.sixteenMax = 65536;
	this.instructions = [];
	this.currentIndex = 0;
	this.isRunnning = false;
	var self = this;

	this.readFile = function(file) {
		var r = new FileReader();
		r.onload = function(e) {
			var contents = e.target.result.split("\n");
			console.log(contents);
			for(line of contents) {
				var bs = self.stringToBytes(line);
				//console.log(bs.reverse());
				for(var i =0; i < bs.length; i += 2){
					var high = bs[i] << 8;
					self.instructions.push(high + bs[i + 1]);
				}
			}
			self.run();
		}
		r.readAsBinaryString(file);
	}

	this.run = function() {
		this.isRunnning = true;
		while(this.isRunnning && this.currentIndex < this.instructions.length) {
			var instruction = this.instructions[this.currentIndex];
			switch(instruction) {
				case 0: this.halt(); break;
				case 19: this.writeAscii(); break;
				//case 21: this.noop();
				default: this.currentIndex++;
			}
		}
	}
	this.halt = function() {
		this.currentIndex++;
		this.isRunnning = false;

	};

	this.writeAscii = function() {
		this.currentIndex++;
		var ins = this.instructions[this.currentIndex];
		var c = String.fromCharCode(ins);
		console.log(c);
		this.currentIndex++;

	}

	this.putAddress = function(address, value) {
		if(address < this.fifteenMax){
			this.memory[address] = ob;
		}else if(address < this.fifteenMax + 8) {
			address -= this.fifteenMax;
			this.registers[address] = value;
		} else if(address >= this.fifteenMax){
			throw("memory address out of range exception")
		} else {
			throw("value out of range exception")
		}
	}

	this.getMemory = function(address) {
		return memory[address]
	}

	this.pushStack = function(value) {
		this.stack.push(value);
	}

	this.popStack = function() {
		this.stack.pop();
	}

	this.stringToBytes = function( str ) {
	  var ch, st, re = [];
	  for (var i = 0; i < str.length; i++ ) {
	    ch = str.charCodeAt(i);  // get char 
	    st = [];                 // set up "stack"
	    do {
	      st.push( ch & 0xFF );  // push byte to stack
	      ch = ch >> 8;          // shift value down by 1 byte
	    }  
	    while ( ch );
	    // add stack contents to result
	    // done because chars have "wrong" endianness
	    re = re.concat( st.reverse() );
	  }
	  // return an array of bytes
	  return re;
	}

}

function loadGame(e) {
	var f = e.target.files[0];
	if(f){
		var vm = new VM();
		vm.readFile(f);
		//vm.run();
	}
	
}

document.getElementById('fileinput').addEventListener('change', loadGame, false);