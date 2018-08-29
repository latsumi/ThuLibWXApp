module.exports = async ctx => {
	var i = 1;
	i = await as_a_test(i)
	var s = "test_thulib"
	ctx.state.data = {s,i}
}


function as_a_test (i){
	return i+1;
}