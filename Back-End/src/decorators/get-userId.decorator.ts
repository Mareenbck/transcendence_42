/* GLOBAL MODULES */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Create @GetCurrentUser decorator - used to get current userID
export const GetCurrentUserId = createParamDecorator(
	(data: string | undefined, context: ExecutionContext) => {
		// Get request from context
		const request = context.switchToHttp().getRequest();
		if (data) {
			return request.user[data];
		}
		// Extract userID from request
		return request.user.userId;
	},
);
