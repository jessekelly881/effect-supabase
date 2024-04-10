import { describe, vi } from "vitest";
import { Fetch } from "@effect/platform/Http/Client";
import { Effect, Config, Secret } from "effect";
import { it } from "@effect/vitest";
import * as Supabase from "@/index";
import { Schema } from "@effect/schema";

const mockSupabaseLayer = Supabase.layer(
	Config.succeed("https://url.com"),
	Config.succeed(Secret.fromString("abc"))
);

describe("Supabase", () => {
	it.effect("Fetch injection", (ctx) => {
		const mockFetch: typeof fetch = vi.fn();
		return Effect.gen(function* (_) {
			const sb = yield * _(Supabase.Supabase);
			yield *
				_(
					Supabase.resolver("tag", {
						request: Schema.void,
						result: Schema.void,
						run: () => sb.client.from("a").select()
					}).execute(),
					Effect.catchAll(() => Effect.unit)
				);
			ctx.expect(mockFetch).toHaveBeenCalledOnce();
		}).pipe(
			Effect.provide(mockSupabaseLayer),
			Effect.provideService(Fetch, mockFetch)
		);
	});
});
