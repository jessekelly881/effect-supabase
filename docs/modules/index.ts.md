---
title: index.ts
nav_order: 1
parent: Modules
---

## index overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [AppMetadata](#appmetadata)
  - [AppMetadata (interface)](#appmetadata-interface)
  - [Factor](#factor)
  - [Factor (interface)](#factor-interface)
  - [Req (interface)](#req-interface)
  - [Resolver (interface)](#resolver-interface)
  - [ResultLengthMismatch](#resultlengthmismatch)
  - [ResultLengthMismatch (interface)](#resultlengthmismatch-interface)
  - [Session](#session)
  - [Session (interface)](#session-interface)
  - [StorageObject (class)](#storageobject-class)
  - [Supabase (class)](#supabase-class)
  - [SupabaseErrorId](#supabaseerrorid)
  - [SupabaseErrorId (type alias)](#supabaseerrorid-type-alias)
  - [User](#user)
  - [User (interface)](#user-interface)
  - [UserId](#userid)
  - [UserIdentity](#useridentity)
  - [UserIdentity (interface)](#useridentity-interface)
  - [UserMetadata](#usermetadata)
  - [UserMetadata (interface)](#usermetadata-interface)
  - [layer](#layer)
  - [resolver](#resolver)
  - [resolverId](#resolverid)
  - [resolverSingle](#resolversingle)
  - [resolverVoid](#resolvervoid)
  - [schema](#schema)
  - [schemaVoid](#schemavoid)
  - [wrapQuery](#wrapquery)

---

# utils

## AppMetadata

**Signature**

```ts
export declare const AppMetadata: S.Schema<AppMetadata, Sb.UserAppMetadata, never>
```

Added in v1.0.0

## AppMetadata (interface)

**Signature**

```ts
export interface AppMetadata extends S.Schema.Type<typeof _AppMetadata> {}
```

Added in v1.0.0

## Factor

**Signature**

```ts
export declare const Factor: S.Schema<Factor, Sb.Factor, never>
```

Added in v1.0.0

## Factor (interface)

**Signature**

```ts
export interface Factor extends S.Schema.Type<typeof _Factor> {}
```

Added in v1.0.0

## Req (interface)

**Signature**

```ts
export interface Req<T, A, IA>
  extends Request.Request<A, ResultLengthMismatch | ParseResult.ParseError | Sb.PostgrestError> {
  readonly value: IA
  readonly _tag: T
}
```

Added in v1.0.0

## Resolver (interface)

**Signature**

```ts
export interface Resolver<T extends string, A, I, E, R> {
  readonly request: Request.Request.Constructor<Req<T, A, I>, "_tag">
  readonly resolver: RequestResolver.RequestResolver<Req<T, A, I>, R>
  readonly execute: (_: I) => Effect.Effect<A, ParseError | E, R>
}
```

Added in v1.0.0

## ResultLengthMismatch

**Signature**

```ts
export declare const ResultLengthMismatch: (expected: number, actual: number) => ResultLengthMismatch
```

Added in v1.0.0

## ResultLengthMismatch (interface)

**Signature**

```ts
export interface ResultLengthMismatch {
  readonly [SupabaseErrorId]: SupabaseErrorId
  readonly _tag: "ResultLengthMismatch"
  readonly expected: number
  readonly actual: number
}
```

Added in v1.0.0

## Session

**Signature**

```ts
export declare const Session: S.Schema<Session, Sb.Session, never>
```

Added in v1.0.0

## Session (interface)

**Signature**

```ts
export interface Session extends S.Schema.Type<typeof _Session> {}
```

Added in v1.0.0

## StorageObject (class)

**Signature**

```ts
export declare class StorageObject
```

Added in v1.0.0

## Supabase (class)

**Signature**

```ts
export declare class Supabase
```

Added in v1.0.0

## SupabaseErrorId

**Signature**

```ts
export declare const SupabaseErrorId: typeof SupabaseErrorId
```

Added in v1.0.0

## SupabaseErrorId (type alias)

**Signature**

```ts
export type SupabaseErrorId = typeof SupabaseErrorId
```

Added in v1.0.0

## User

**Signature**

```ts
export declare const User: S.Schema<User, Sb.User, never>
```

Added in v1.0.0

## User (interface)

**Signature**

```ts
export interface User extends S.Schema.Type<typeof _User> {}
```

Added in v1.0.0

## UserId

**Signature**

```ts
export declare const UserId: S.brand<S.$string, "UserId">
```

Added in v1.0.0

## UserIdentity

**Signature**

```ts
export declare const UserIdentity: S.Schema<UserIdentity, Sb.UserIdentity, never>
```

Added in v1.0.0

## UserIdentity (interface)

**Signature**

```ts
export interface UserIdentity extends S.Schema.Type<typeof _UserIdentity> {}
```

Added in v1.0.0

## UserMetadata

**Signature**

```ts
export declare const UserMetadata: S.Schema<UserMetadata, Sb.UserMetadata, never>
```

Added in v1.0.0

## UserMetadata (interface)

**Signature**

```ts
export interface UserMetadata extends S.Schema.Type<typeof _UserMetadata> {}
```

Added in v1.0.0

## layer

**Signature**

```ts
export declare const layer: (
  supabaseUrl: Config.Config<string>,
  supabaseKey: Config.Config<Secret.Secret>
) => Layer.Layer<Supabase, ConfigError, never>
```

Added in v1.0.0

## resolver

**Signature**

```ts
export declare const resolver: <
  T extends string,
  IR,
  II,
  IA,
  AR,
  AI,
  A,
  Q extends PostgrestFilterBuilder<any, any, unknown[], unknown, unknown>
>(
  tag: T,
  options: {
    readonly request: S.Schema<IA, II, IR>
    readonly result: S.Schema<A, AI, AR>
    run: (requests: readonly II[]) => Q
  }
) => Resolver<T, A, IA, ResultLengthMismatch | Sb.PostgrestError, IR | AR>
```

Added in v1.0.0

## resolverId

**Signature**

```ts
export declare const resolverId: <
  T extends string,
  A,
  AI,
  AR,
  IA,
  II,
  IR,
  Q extends PostgrestFilterBuilder<any, any, unknown[], unknown, unknown>
>(
  tag: T,
  options: {
    readonly id: S.Schema<IA, II, IR>
    readonly result: S.Schema<A, AI, AR>
    readonly resultId: (_: AI) => IA
    readonly run: (requests: readonly II[]) => Q
  }
) => {
  request: Request.Request.Constructor<Req<T, Option.Option<A>, IA>, "_tag">
  resolver: RequestResolver.RequestResolver<Req<T, Option.Option<A>, IA>, AR | IR>
  execute: (
    i: IA
  ) => Effect.Effect<Option.Option<A>, ResultLengthMismatch | Sb.PostgrestError | ParseResult.ParseError, AR | IR>
}
```

Added in v1.0.0

## resolverSingle

**Signature**

```ts
export declare const resolverSingle: <
  T extends string,
  A,
  AI,
  AR,
  IA,
  II,
  IR,
  Q extends PostgrestFilterBuilder<any, any, unknown, unknown, unknown>
>(
  tag: T,
  options: {
    readonly request: S.Schema<IA, II, IR>
    readonly result: S.Schema<A, AI, AR>
    readonly run: (request: II) => Q
  }
) => {
  request: Request.Request.Constructor<Req<T, A, IA>, "_tag">
  resolver: RequestResolver.RequestResolver<Req<T, A, IA>, AR | IR>
  execute: (i: IA) => Effect.Effect<A, ResultLengthMismatch | Sb.PostgrestError | ParseResult.ParseError, AR | IR>
}
```

Added in v1.0.0

## resolverVoid

**Signature**

```ts
export declare const resolverVoid: <
  T extends string,
  IR,
  II,
  IA,
  Q extends PostgrestFilterBuilder<any, any, any, unknown, unknown>
>(
  tag: T,
  options: { readonly request: S.Schema<IA, II, IR>; run: (requests: readonly II[]) => Q }
) => Resolver<T, void, IA, ResultLengthMismatch | Sb.PostgrestError, IR>
```

Added in v1.0.0

## schema

**Signature**

```ts
export declare function schema<A, AI, AR, IA, II, IR, Q extends PostgrestFilterBuilder<any, any, unknown>>(options: {
  request: S.Schema<IA, II, IR>
  result: S.Schema<A, AI, AR>
  run: (_: II) => Q
}): (_: IA) => Effect.Effect<ReadonlyArray<A>, ParseResult.ParseError, IR | AR>
```

Added in v1.0.0

## schemaVoid

**Signature**

```ts
export declare function schemaVoid<IA, II, IR, Q extends PostgrestFilterBuilder<any, any, unknown>>(options: {
  request: S.Schema<IA, II, IR>
  run: (_: II) => Q
}): (_: IA) => Effect.Effect<void, ParseResult.ParseError, IR>
```

Added in v1.0.0

## wrapQuery

Converts a PostgrestFilterBuilder into an Effect.
Handles mapping { data, error } response.

**Signature**

```ts
export declare const wrapQuery: <A>() => <Q extends PostgrestFilterBuilder<any, any, A, unknown, unknown>>(
  q: () => Q
) => Effect.Effect<A, Sb.PostgrestError, never>
```

Added in v1.0.0
