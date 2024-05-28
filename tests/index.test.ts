import { beforeAll, describe, vi } from "vitest";
import { Fetch } from "@effect/platform/Http/Client";
import { Effect } from "effect";
import { it } from "@effect/vitest";
import * as Supabase from "@/index";
import { Schema } from "@effect/schema";
import {
	tableSchemas,
	mockSupabaseLayer,
	mockServer,
	testTodos
} from "./utils";

describe("SupabaseError", () => {
	it("new SupabaseError(...)", (ctx) => {
		const sbErr = new Supabase.SupabaseError({ method: "testMethod" });
		ctx.expect(sbErr.name).toBe("SupabaseError");
	});

	it("fromError", (ctx) => {
		const method = "testMethod";
		const err = new Error("msg");
		const sbErr = Supabase.SupabaseError.fromError(method, err);

		ctx.expect(sbErr.method).toBe(method);
		ctx.expect(sbErr.message).toBe(err.message);
		ctx.expect(sbErr.name).toBe(err.name);
		ctx.expect(sbErr.stack).toBe(err.stack);
	});
});

beforeAll(() => mockServer.listen());

describe("Supabase", () => {
	it.effect("Fetch injection", (ctx) => {
		const mockFetch = vi.fn();
		return Effect.gen(function* (_) {
			const sb = yield* Supabase.Supabase;
			yield* _(
				Supabase.resolver("tag", {
					request: Schema.Void,
					result: Schema.Void,
					run: () => sb.client.from("table-name").select()
				}).execute(),
				Effect.catchAll(() => Effect.void)
			);
			ctx.expect(mockFetch).toHaveBeenCalledOnce();
		}).pipe(
			Effect.provide(mockSupabaseLayer),
			Effect.provideService(Fetch, mockFetch)
		);
	});

	it.effect("execute", (ctx) =>
		Effect.gen(function* () {
			const sb = yield* Supabase.Supabase;
			const r = Supabase.resolver("tag", {
				request: Schema.Number,
				result: tableSchemas.todos,
				run: (ids) => sb.client.from("todos").select().in("id", ids)
			});

			const result = yield* r.execute(0);
			ctx.expect(result).toEqual(testTodos[0]);
		}).pipe(Effect.provide(mockSupabaseLayer))
	);
});
