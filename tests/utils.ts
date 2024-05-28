/**
 * @since 1.0.0
 */
import { Schema, Arbitrary } from "@effect/schema";
import * as Supabase from "@/index";
import { Secret, Config } from "effect";
import { http } from "msw";
import { setupServer } from "msw/node";
import * as fc from "fast-check";
import { HttpServer } from "@effect/platform";

export const Todo = Schema.Struct({
	id: Schema.String,
	text: Schema.String,
	done: Schema.Boolean
});

export const User = Schema.Struct({
	id: Schema.String,
	name: Schema.String,
	email: Schema.String
});

export const tableSchemas = {
	todos: Todo,
	users: User
};

const SUPABASE_URL = "https://url.com";
const SUPABASE_KEY = Secret.fromString("abc");

export const mockSupabaseLayer = Supabase.layer(
	Config.succeed(SUPABASE_URL),
	Config.succeed(SUPABASE_KEY)
);

export const testTodos = [{ id: "1", text: "todo 1", done: false }];

const router = HttpServer.router.empty.pipe(
	HttpServer.router.all("*", HttpServer.response.json(testTodos)),
);

export const mockServer = setupServer(
	http.all(`${SUPABASE_URL}/rest/v1/todos`, (s) =>
		HttpServer.app.toWebHandler(router)(s.request),
	),
);
