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
  - [Session](#session)
  - [Session (interface)](#session-interface)
  - [Supabase (class)](#supabase-class)
  - [User](#user)
  - [User (interface)](#user-interface)
  - [UserId](#userid)
  - [UserIdentity](#useridentity)
  - [UserIdentity (interface)](#useridentity-interface)
  - [UserMetadata](#usermetadata)
  - [UserMetadata (interface)](#usermetadata-interface)
  - [layer](#layer)

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

## Supabase (class)

**Signature**

```ts
export declare class Supabase
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
  supabaseUrl: string,
  supabaseKey: string,
  options?: Sb.SupabaseClientOptions<never> | undefined
) => Layer.Layer<Supabase, never, never>
```

Added in v1.0.0
