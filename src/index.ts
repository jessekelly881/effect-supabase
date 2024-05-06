/**
 * @since 1.0.0
 */
import * as Sb from "@supabase/supabase-js";
import { Schema as S, ParseResult } from "@effect/schema";
import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Fetch } from "@effect/platform/Http/Client";
import {
	Effect,
	Option,
	Layer,
	Data,
	Request,
	RequestResolver,
	pipe,
	Config,
	Secret,
	Stream,
	Cause,
	Struct
} from "effect";

/**
 * @since 1.0.0
 */
export class SupabaseError extends S.TaggedError<SupabaseError>()(
	"SupabaseError",
	{
		method: S.String,

		message: S.optional(S.String),
		name: S.optional(S.String),
		stack: S.optional(S.String)
	}
) {
	/**
	 * Converts an instance of Error to an instance of SupabaseError
	 * @since 1.0.0
	 */
	static fromError(method: string, err: Error) {
		return new SupabaseError({
			method,
			message: err.message,
			name: err.name,
			stack: err.stack
		});
	}
}

/**
 * @since 1.0.0
 */
export const SupabaseErrorId = Symbol.for("effect-supabase/Error");

/**
 * @since 1.0.0
 */
export type SupabaseErrorId = typeof SupabaseErrorId;

/**
 * @since 1.0.0
 */
export const ResultLengthMismatch = (expected: number, actual: number) =>
	Data.tagged<ResultLengthMismatch>("ResultLengthMismatch")({
		[SupabaseErrorId]: SupabaseErrorId,
		expected,
		actual
	});

/**
 * @since 1.0.0
 */
export interface ResultLengthMismatch {
	readonly [SupabaseErrorId]: SupabaseErrorId;
	readonly _tag: "ResultLengthMismatch";
	readonly expected: number;
	readonly actual: number;
}

const ps = S.propertySignature;

/** @internal */
const TimeStamped = S.Struct({
	createdAt: S.Date.pipe(ps, S.fromKey("created_at")),
	updatedAt: S.Date.pipe(ps, S.fromKey("updated_at"))
});

/**
 * @since 1.0.0
 */
export const UserId = S.UUID.pipe(S.brand("UserId"));

/**
 * @since 1.0.0
 */
export type UserId = S.Schema.Type<typeof UserId>;

/** @internal */
const _AppMetadata = S.Struct(
	{ provider: S.optional(S.String) },
	S.Record(S.String, S.Unknown)
);

/**
 * @since 1.0.0
 */
export interface AppMetadata extends S.Schema.Type<typeof _AppMetadata> {}

/**
 * @since 1.0.0
 */
export const AppMetadata: S.Schema<AppMetadata, Sb.UserAppMetadata> =
	_AppMetadata;

/** @internal */
const _UserMetadata = S.Record(S.String, S.Unknown) satisfies S.Schema<
	any,
	Sb.UserMetadata
>;

/**
 * @since 1.0.0
 */
export interface UserMetadata extends S.Schema.Type<typeof _UserMetadata> {}

/**
 * @since 1.0.0
 */
export const UserMetadata: S.Schema<UserMetadata, Sb.UserMetadata> =
	_UserMetadata;

/** @internal */
const _UserIdentity = S.Struct({
	id: S.String,
	userId: UserId.pipe(ps, S.fromKey("user_id")),
	identityData: S.optional(S.Record(S.String, S.Unknown)).pipe(
		S.fromKey("identity_data")
	),
	identityId: S.String.pipe(ps, S.fromKey("identity_id")),
	provider: S.String,
	lastSignInAt: S.optional(S.String).pipe(S.fromKey("last_sign_in_at")),
	createdAt: S.optional(S.Date).pipe(S.fromKey("created_at")),
	updatedAt: S.optional(S.Date).pipe(S.fromKey("updated_at"))
});

/**
 * @since 1.0.0
 */
export interface UserIdentity extends S.Schema.Type<typeof _UserIdentity> {}

/**
 * @since 1.0.0
 */
export const UserIdentity: S.Schema<UserIdentity, Sb.UserIdentity> =
	_UserIdentity;

/** @internal */
const _Factor = S.Struct({
	id: S.String,
	friendlyName: S.optional(S.String).pipe(S.fromKey("friendly_name")),
	factorType: S.String.pipe(ps, S.fromKey("factor_type")),
	status: S.Literal("verified", "unverified"),
	...TimeStamped.fields
});

/**
 * @since 1.0.0
 */
export interface Factor extends S.Schema.Type<typeof _Factor> {}

/**
 * @since 1.0.0
 */
export const Factor: S.Schema<Factor, Sb.Factor> = _Factor;

/** @internal */
const _User = S.Struct({
	id: UserId,
	appMetadata: AppMetadata.pipe(ps, S.fromKey("app_metadata")),
	userMetadata: UserMetadata.pipe(ps, S.fromKey("user_metadata")),
	aud: S.String,

	confirmationSentAt: S.optional(S.Date).pipe(
		S.fromKey("confirmation_sent_at")
	),
	recoverySentAt: S.optional(S.Date).pipe(S.fromKey("recovery_sent_at")),
	emailChangeSentAt: S.optional(S.Date).pipe(
		S.fromKey("email_change_sent_at")
	),
	newEmail: S.optional(S.String).pipe(S.fromKey("new_email")),
	newPhone: S.optional(S.String).pipe(S.fromKey("new_phone")),
	invitedAt: S.optional(S.String).pipe(S.fromKey("invited_at")),
	actionLink: S.optional(S.String).pipe(S.fromKey("action_link")),
	email: S.optional(S.String),
	phone: S.optional(S.String),
	confirmedAt: S.optional(S.Date).pipe(S.fromKey("confirmed_at")),
	emailConfirmedAt: S.optional(S.Date).pipe(S.fromKey("email_confirmed_at")),
	phoneConfirmedAt: S.optional(S.String).pipe(
		S.fromKey("phone_confirmed_at")
	),
	lastSignInAt: S.optional(S.Date).pipe(S.fromKey("last_sign_in_at")),
	role: S.optional(S.String),
	identities: S.optional(S.Array(UserIdentity).pipe(S.mutable)),
	factors: S.optional(S.Array(Factor).pipe(S.mutable)),

	createdAt: S.Date.pipe(ps, S.fromKey("created_at")),
	updatedAt: S.optional(S.Date).pipe(S.fromKey("updated_at"))
});

/**
 * @since 1.0.0
 */
export interface User extends S.Schema.Type<typeof _User> {}

/**
 * @since 1.0.0
 */
export const User: S.Schema<User, Sb.User> = _User;

/** @internal */
const _Session = S.Struct({
	providerToken: S.optional(S.String, { nullable: true }).pipe(
		S.fromKey("provider_token")
	),
	providerRefreshToken: S.optional(S.String, { nullable: true }).pipe(
		S.fromKey("provider_refresh_token")
	),
	accessToken: S.String.pipe(ps, S.fromKey("access_token")),
	refreshToken: S.String.pipe(ps, S.fromKey("refresh_token")),
	expiresIn: S.Number.pipe(ps, S.fromKey("expires_in")),
	expiresAt: S.optional(S.Number).pipe(S.fromKey("expires_at")),
	tokenType: S.String.pipe(ps, S.fromKey("token_type")),
	user: User
});

/**
 * @since 1.0.0
 */
export interface Session extends S.Schema.Type<typeof _Session> {}

/**
 * @since 1.0.0
 */
export const Session: S.Schema<Session, Sb.Session> = _Session;

/** @internal  */
const decodeSession = S.decodeSync(Session);

/** @internal  */
const decodeUser = S.decodeSync(User);

/** @internal  */
const wrapAuthResponse = (methodName: string) => (res: Sb.AuthResponse) =>
	res.error
		? SupabaseError.fromError(methodName, res.error)
		: Effect.succeed(Option.map(Option.fromNullable(res.data.session), decodeSession));

/**
 * @since 1.0.0
 */
export class StorageObject extends S.Class<StorageObject>("Storage.Object")(
	// TODO: namespace Storage, Public
	{
		id: S.UUID,
		bucketId: S.String.pipe(ps, S.fromKey("bucket_id")),
		name: S.String
		// TODO: Add missing fields
	}
) {}

/**
 * @since 1.0.0
 */
export interface Req<T, A, IA>
	extends Request.Request<
		A,
		ResultLengthMismatch | ParseResult.ParseError | Sb.PostgrestError
	> {
	readonly value: IA;
	readonly _tag: T;
}

/**
 * @since 1.0.0
 */
export interface Resolver<T extends string, A, I, E, R> {
	readonly request: Request.Request.Constructor<Req<T, A, I>, "_tag">;
	readonly resolver: RequestResolver.RequestResolver<Req<T, A, I>, R>;
	readonly execute: (_: I) => Effect.Effect<A, ParseResult.ParseError | E, R>;
}

/**
 * Converts a PostgrestFilterBuilder into an Effect.
 * Handles mapping { data, error } response.
 *
 * @since 1.0.0
 */
export const wrapQuery =
	<A>() =>
	<Q extends PostgrestFilterBuilder<any, any, A>>(
		q: () => Q
	): Effect.Effect<A, Sb.PostgrestError> =>
		Effect.promise((signal) => q().abortSignal(signal)).pipe(
			Effect.flatMap((res) =>
				res.error ? Effect.fail(res.error) : Effect.succeed(res.data)
			)
		);

/**
 * @since 1.0.0
 */
export const resolverId = <
	T extends string,
	A,
	AI,
	AR,
	IA,
	II,
	IR,
	Q extends PostgrestFilterBuilder<any, any, unknown[]>
>(
	tag: T,
	options: {
		readonly id: S.Schema<IA, II, IR>;
		readonly result: S.Schema<A, AI, AR>;
		readonly resultId: (_: AI) => IA;
		readonly run: (requests: ReadonlyArray<II>) => Q;
	}
) => {
	const request = Request.tagged<Req<T, Option.Option<A>, IA>>(tag);
	const encodeRequests = S.encode(S.Array(options.id));
	const decodeResults = S.decodeUnknown(S.Array(options.result));

	const resolver = RequestResolver.makeBatched(
		(requests: ReadonlyArray<Req<T, Option.Option<A>, IA>>) =>
			pipe(
				encodeRequests(requests.map((r) => r.value)),
				Effect.flatMap((as) =>
					wrapQuery<unknown[]>()(() => options.run(as))
				),
				Effect.flatMap((results) => {
					const resultsMap = new Map<IA, A>();
					return Effect.map(decodeResults(results), (decoded) => {
						decoded.forEach((result, i) => {
							const id = options.resultId(results[i] as any);
							resultsMap.set(id, result);
						});
						return resultsMap;
					});
				}),
				Effect.tap((results) =>
					Effect.forEach(
						requests,
						(req) => {
							const id = req.value;
							const result = results.get(id);

							return Request.succeed(
								req,
								Option.fromNullable(result)
							);
						},
						{ discard: true }
					)
				),
				Effect.catchAllCause((error) =>
					Effect.forEach(
						requests,
						(req) => Request.failCause(req, error),
						{
							discard: true
						}
					)
				)
			)
	);

	const execute = (i: IA) =>
		Effect.request(
			request({ value: i }),
			RequestResolver.contextFromEffect(resolver)
		).pipe(Effect.withSpan(tag));

	return { request, resolver, execute };
};

/**
 * @since 1.0.0
 */
export const resolver = <
	T extends string,
	IR,
	II,
	IA,
	AR,
	AI,
	A,
	Q extends PostgrestFilterBuilder<any, any, unknown[]>
>(
	tag: T,
	options: {
		readonly request: S.Schema<IA, II, IR>;
		readonly result: S.Schema<A, AI, AR>;
		run: (requests: ReadonlyArray<II>) => Q;
	}
): Resolver<T, A, IA, ResultLengthMismatch | Sb.PostgrestError, IR | AR> => {
	const request = Request.tagged<Req<T, A, IA>>(tag);
	const decodeResult = S.decodeUnknown(options.result);
	const encodeRequests = S.encode(S.Array(options.request));

	const resolver = RequestResolver.makeBatched((requests: Req<T, A, IA>[]) =>
		pipe(
			encodeRequests(requests.map((r) => r.value)),
			Effect.flatMap((as) =>
				wrapQuery<unknown[]>()(() => options.run(as))
			),
			Effect.filterOrFail(
				(results) => results.length === requests.length,
				(_) => ResultLengthMismatch(requests.length, _.length)
			),
			Effect.flatMap((results) =>
				Effect.forEach(results, (result, i) =>
					pipe(
						decodeResult(result),
						Effect.flatMap((result) =>
							Request.succeed(requests[i], result)
						),
						Effect.catchAll((error) =>
							Request.fail(requests[i], error as any)
						)
					)
				)
			),
			Effect.catchAll((error) =>
				Effect.forEach(requests, (req) => Request.fail(req, error), {
					discard: true
				})
			)
		)
	);

	const execute = (i: IA) =>
		Effect.request(
			request({ value: i }),
			RequestResolver.contextFromEffect(resolver)
		).pipe(Effect.withSpan(tag));

	return { request, resolver, execute };
};

/**
 * @since 1.0.0
 */
export const resolverVoid = <
	T extends string,
	IR,
	II,
	IA,
	Q extends PostgrestFilterBuilder<any, any, any>
>(
	tag: T,
	options: {
		readonly request: S.Schema<IA, II, IR>;
		run: (requests: ReadonlyArray<II>) => Q;
	}
): Resolver<T, void, IA, ResultLengthMismatch | Sb.PostgrestError, IR> => {
	const request = Request.tagged<Req<T, void, IA>>(tag);
	const encodeRequests = S.encode(S.Array(options.request));

	const resolver = RequestResolver.makeBatched(
		(requests: Req<T, void, IA>[]) =>
			pipe(
				encodeRequests(requests.map((r) => r.value)),
				Effect.flatMap((as) =>
					wrapQuery<unknown[]>()(() => options.run(as) as any)
				),
				Effect.filterOrFail(
					(results) => results.length === requests.length,
					(_) => ResultLengthMismatch(requests.length, _.length)
				),
				Effect.zipRight(
					Effect.forEach(
						requests,
						(req) => Request.succeed(req, void 0 as any),
						{ discard: true }
					)
				),
				Effect.catchAll((error) =>
					Effect.forEach(
						requests,
						(req) => Request.fail(req, error),
						{
							discard: true
						}
					)
				)
			)
	);

	const execute = (i: IA) =>
		Effect.request(
			request({ value: i }),
			RequestResolver.contextFromEffect(resolver)
		).pipe(Effect.withSpan(tag));

	return { request, resolver, execute };
};

/**
 * @since 1.0.0
 */
export const resolverSingle = <
	T extends string,
	A,
	AI,
	AR,
	IA,
	II,
	IR,
	Q extends PostgrestFilterBuilder<any, any, unknown>
>(
	tag: T,
	options: {
		readonly request: S.Schema<IA, II, IR>;
		readonly result: S.Schema<A, AI, AR>;
		readonly run: (request: II) => Q;
	}
) => {
	const request = Request.tagged<Req<T, A, IA>>(tag);
	const encodeRequest = S.encode(options.request);
	const decodeResult = S.decodeUnknown(options.result);

	const resolver = RequestResolver.fromEffect((req: Req<T, A, IA>) =>
		pipe(
			encodeRequest(req.value),
			Effect.flatMap((as) =>
				wrapQuery<unknown>()(() => options.run(as) as any)
			),
			Effect.flatMap(decodeResult)
		)
	);

	const execute = (i: IA) =>
		Effect.request(
			request({ value: i }),
			RequestResolver.contextFromEffect(resolver)
		).pipe(Effect.withSpan(tag));

	return { request, resolver, execute };
};

/**
 * @since 1.0.0
 */
export function schema<
	A,
	AI,
	AR,
	IA,
	II,
	IR,
	Q extends PostgrestFilterBuilder<any, any, unknown>
>(options: {
	request: S.Schema<IA, II, IR>;
	result: S.Schema<A, AI, AR>;
	run: (_: II) => Q;
}): (
	_: IA
) => Effect.Effect<ReadonlyArray<A>, ParseResult.ParseError, IR | AR> {
	const decodeResult = S.decodeUnknown(S.Array(options.result));
	const encodeRequest = S.encode(options.request);

	return (_: IA) =>
		pipe(
			encodeRequest(_),
			Effect.flatMap((as) =>
				Effect.promise((signal) =>
					options.run(as).abortSignal(signal)
				).pipe(Effect.map((res) => res.data))
			),
			Effect.flatMap(decodeResult)
		);
}

/**
 * @since 1.0.0
 */
export function schemaVoid<
	IA,
	II,
	IR,
	Q extends PostgrestFilterBuilder<any, any, unknown>
>(options: {
	request: S.Schema<IA, II, IR>;
	run: (_: II) => Q;
}): (_: IA) => Effect.Effect<void, ParseResult.ParseError, IR> {
	const encodeRequest = S.encode(options.request);
	return (_: IA) =>
		Effect.asVoid(
			Effect.flatMap(encodeRequest(_), (as) =>
				Effect.promise((signal) => options.run(as).abortSignal(signal))
			)
		);
}

/**
 * @since 1.0.0
 */
export class Supabase extends Effect.Tag("Supabase")<
	Supabase,
	{
		/**
		 * @since 1.0.0
		 */
		client: Sb.SupabaseClient<any, any, any>;

		/**
		 * Uses onAuthStateChange to watch auth state.
		 * @since 1.0.0
		 */
		authState: Stream.Stream<
			[Sb.AuthChangeEvent, Option.Option<Session>],
			never,
			never
		>;

		/**
		 * @since 1.0.0
		 */
		signUp: (
			credentials: Sb.SignUpWithPasswordCredentials
		) => Effect.Effect<Option.Option<Session>, SupabaseError>;

		/**
		 * @since 1.0.0
		 */
		signOut: (
			options?: Sb.SignOut
		) => Effect.Effect<void, SupabaseError, never>;

		/**
		 * @since 1.0.0
		 */
		signInWithOAuth: (
			credentials: Sb.SignInWithOAuthCredentials
		) => Effect.Effect<
			{
				provider: Sb.Provider;
				url: string;
			},
			SupabaseError
		>;

		/**
		 * @since 1.0.0
		 */
		signInWithPassword: (
			credentials: Sb.SignInWithPasswordCredentials
		) => Effect.Effect<Session, SupabaseError>;

		signInWithIdToken: (
			credentials: Sb.SignInWithIdTokenCredentials
		) => Effect.Effect<Option.Option<Session>, SupabaseError, never>;

		setSession: (tokens: {
			accessToken: string;
			refreshToken: string;
		}) => Effect.Effect<Option.Option<Session>, SupabaseError, never>;

		/**
		 * Gets the current user from the database
		 * @since 1.0.0
		 */
		getUser: Effect.Effect<Option.Option<User>>;

		/**
		 * Gets the current (locally saved) session.
		 * @since 1.0.0
		 */
		getSession: Effect.Effect<Option.Option<Session>, SupabaseError, never>;
	}
>() {}

/**
 * @since 1.0.0
 */
export const layer = (
	urlConfig: Config.Config<string>,
	keyConfig: Config.Config<Secret.Secret>,
	options?: Sb.SupabaseClientOptions<"public">
) =>
	Layer.effect(
		Supabase,
		Effect.gen(function* (_) {
			const config = yield* _(
				Config.all({
					url: urlConfig,
					key: keyConfig
				})
			);
			const fetch = (yield* _(Effect.serviceOption(Fetch))).pipe(
				Option.getOrUndefined
			);

			const client = yield* _(
				Effect.sync(() =>
					Sb.createClient(config.url, Secret.value(config.key), {
						...Struct.omit(options || {}, "global"),
						global: {
							...Struct.omit(options?.global || {}, "fetch"),
							fetch
						}
					})
				)
			);

			const authState = Stream.async<
				[Sb.AuthChangeEvent, Option.Option<Session>]
			>((emit) => {
				const { data } = client.auth.onAuthStateChange(
					(event, session) =>
						emit.single([
							event,
							Option.fromNullable(session).pipe(
								Option.map(decodeSession)
							)
						])
				);

				return Effect.sync(() => data.subscription.unsubscribe());
			});

			const signOut = (options?: Sb.SignOut) =>
				Effect.flatMap(
					Effect.promise(() => client.auth.signOut(options)),
					(res) =>
						res.error
							? Effect.fail(
									SupabaseError.fromError(
										"signOut",
										res.error
									)
								)
							: Effect.void
				);

			const signUp = (credentials: Sb.SignUpWithPasswordCredentials) =>
				Effect.flatMap(
					Effect.promise(() => client.auth.signUp(credentials)),
					wrapAuthResponse("signUp")
				);

			const signInWithOAuth = (
				credentials: Sb.SignInWithOAuthCredentials
			) =>
				Effect.promise(() =>
					client.auth.signInWithOAuth(credentials)
				).pipe(
					Effect.flatMap((s) =>
						s.error
							? Effect.fail(
									SupabaseError.fromError(
										"signInWithOAuth",
										s.error
									)
								)
							: Effect.succeed(s.data)
					)
				);

			const setSession = (tokens: {
				accessToken: string;
				refreshToken: string;
			}) =>
				Effect.flatMap(
					Effect.promise(() =>
						client.auth.setSession({
							access_token: tokens.accessToken,
							refresh_token: tokens.refreshToken
						})
					),
					wrapAuthResponse("setSession")
				);

			const signInWithPassword = (
				// todo - return WeakPassword obj
				credentials: Sb.SignInWithPasswordCredentials
			) =>
				Effect.promise(() =>
					client.auth.signInWithPassword(credentials)
				).pipe(
					Effect.flatMap((s) =>
						s.error
							? Effect.fail(
									SupabaseError.fromError(
										"signInWithOAuth",
										s.error
									)
								)
							: s.data
								? Effect.succeed(decodeSession(s.data.session))
								: Effect.die(Cause.UnknownException)
					)
				);

			const signInWithIdToken = (
				credentials: Sb.SignInWithIdTokenCredentials
			) =>
				Effect.flatMap(
					Effect.promise(() =>
						client.auth.signInWithIdToken(credentials)
					),
					wrapAuthResponse("signInWithIdToken")
				);

			const getSession = Effect.promise(() =>
				client.auth.getSession()
			).pipe(
				Effect.flatMap((res) =>
					res.error
						? Effect.fail(
								SupabaseError.fromError("getSession", res.error)
							)
						: Effect.succeed(
								Option.fromNullable(res.data.session).pipe(
									Option.map(decodeSession)
								)
							)
				)
			);

			const getUser = Effect.gen(function* (_) {
				const { data } = yield* _(
					Effect.promise(() => client.auth.getUser())
				);

				if (!data || !data.user) {
					return Option.none<User>();
				}

				const user = decodeUser(data.user);
				return Option.some(user);
			});

			return Supabase.of({
				client,
				getUser,
				getSession,
				authState,
				signUp,
				signOut,
				signInWithOAuth,
				signInWithPassword,
				setSession,
				signInWithIdToken
			});
		})
	);
