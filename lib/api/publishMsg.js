export function request(ctx) {
	console.log('the context', ctx)
	return {
		payload: {
			msg: ctx.args.msg,
		},
	}
}

export function response(ctx) {
	console.log(ctx.result.msg)
	return ctx.result.msg
}
