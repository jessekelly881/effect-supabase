import { describe, vi } from "vitest";
import { Fetch } from "@effect/platform/Http/Client";
import { Effect, Config, Secret } from "effect";
import { it } from "@effect/vitest";
import * as Supabase from "@/index";
import { Schema } from "@effect/schema";

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

const mockSupabaseLayer = Supabase.layer({
	supabaseUrl: Config.succeed("https://url.com"),
	supabaseKey: Config.succeed(Secret.fromString("abc"))
});

describe("Supabase", () => {
	it.effect("Fetch injection", (ctx) => {
		const mockFetch: typeof fetch = vi.fn();
		return Effect.gen(function* (_) {
			const sb = yield * _(Supabase.Supabase);
			yield *
				_(
					Supabase.resolver("tag", {
						request: Schema.Void,
						result: Schema.Void,
						run: () => sb.client.from("a").select()
					}).execute(),
					Effect.catchAll(() => Effect.void)
				);
			ctx.expect(mockFetch).toHaveBeenCalledOnce();
		}).pipe(
			Effect.provide(mockSupabaseLayer),
			Effect.provideService(Fetch, mockFetch)
		);
	});
});
