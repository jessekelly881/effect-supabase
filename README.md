# effect-supabase

An [Effect](https://github.com/effect-ts/effect) wrapper for the Supabase sdk.

## Database queries

Queries are inspired by and hope to be as complete as those provided by [sqlfx](https://github.com/tim-smart/sqlfx).

```ts
import { Supabase } from "effect-supabase";
import { Schema } from "@effect/schema";

const EventId = Schema.Int.pipe(Schema.brand(""EventId));

const Event = Schema.Struct({
  starts: Schema.Date
});

export const getEventById = (id: EventId) =>
  Effect.flatMap(Supabase, (sb) =>
    Supabase.resolver("getEventById", {
        result: Event,
        request: EventId,
 run: (ids) => sb.client.from("events").select("*").in("id", ids)
    }).execute(id)
  ).pipe(Effect.withSpan("getEventById", { attributes: { id } }));
```

## Functions

Simplified edge functions using Effect and HatTip.

```ts
import { Effect } from "npm:effect";
import { createServeHandler } from "npm:@hattip/adapter-deno";
import { HttpServer } from "npm:@effect/platform";

const handler = HttpServer.app.toWebHandler(
  Effect.map(HttpServer.request.ServerRequest, (req: Request) =>
   HttpServer.response.text(req.url),
  )
 );

Deno.serve(
 createServeHandler(({ request }: { request: Request }) => handler(request)),
);
```
