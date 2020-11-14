var s = function (p){
	let shader_test;
	p.preload = function(){
		shader_test = p.loadShader("shaders/blank.vert", "shaders/test.frag");
	};
	p.setup = function(){
		p.createCanvas(900,480, p.WEBGL);
	};
	p.draw = function(){
		p.resetShader();
		p.shader(shader_test);
		shader_test.setUniform("iResolution", [900, 480]);
		shader_test.setUniform("iTime", p.millis()/100.0);	
		p.rect(0, 0, 900, 480);

	};
};

document.addEventListener("DOMContentLoaded", function(){
	var myp5 = new p5(s, 'c1');
	});
	

