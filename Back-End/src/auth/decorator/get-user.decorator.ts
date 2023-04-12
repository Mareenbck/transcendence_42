import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// @GetCurrentUser decorator - used to get current user
export const GetUser = createParamDecorator(
	(data: string | undefined, context: ExecutionContext) => {
		// Get request from context
		console.log("request->")

		const request = context.switchToHttp().getRequest();
		console.log("request->")
		console.log(request)
		// Extract user from request
		if (!data) {
			return request.user;
		}
		// Extract user data from request
		return request.user[data];
	},
);
