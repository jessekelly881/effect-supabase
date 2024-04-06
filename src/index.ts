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
	Cause
} from "effect";
import { ParseError } from "@effect/schema/ParseResult";

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
const TimeStamped = S.struct({
	createdAt: S.Date.pipe(ps, S.fromKey("created_at")),
	updatedAt: S.Date.pipe(ps, S.fromKey("updated_at"))
});

/**
 * @since 1.0.0
 */
export const UserId = S.UUID.pipe(S.brand("UserId"));

/** @internal */
const _AppMetadata = S.struct(
	{ provider: S.optional(S.string) },
	S.record(S.string, S.unknown)
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
const _UserMetadata = S.record(S.string, S.unknown) satisfies S.Schema<
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
const _UserIdentity = S.struct({
	id: S.string,
	userId: UserId.pipe(ps, S.fromKey("user_id")),
	identityData: S.optional(S.record(S.string, S.unknown)).pipe(
		S.fromKey("identity_data")
	),
	identityId: S.string.pipe(ps, S.fromKey("identity_id")),
	provider: S.string,
	lastSignInAt: S.optional(S.string).pipe(S.fromKey("last_sign_in_at")),
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
const _Factor = S.struct({
	id: S.string,
	friendlyName: S.optional(S.string).pipe(S.fromKey("friendly_name")),
	factorType: S.string.pipe(ps, S.fromKey("factor_type")),
	status: S.literal("verified", "unverified"),
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
const _User = S.struct({
	id: UserId,
	appMetadata: AppMetadata.pipe(ps, S.fromKey("app_metadata")),
	userMetadata: UserMetadata.pipe(ps, S.fromKey("user_metadata")),
	aud: S.string,

	confirmationSentAt: S.optional(S.Date).pipe(
		S.fromKey("confirmation_sent_at")
	),
	recoverySentAt: S.optional(S.Date).pipe(S.fromKey("recovery_sent_at")),
	emailChangeSentAt: S.optional(S.Date).pipe(
		S.fromKey("email_change_sent_at")
	),
	newEmail: S.optional(S.string).pipe(S.fromKey("new_email")),
	newPhone: S.optional(S.string).pipe(S.fromKey("new_phone")),
	invitedAt: S.optional(S.string).pipe(S.fromKey("invited_at")),
	actionLink: S.optional(S.string).pipe(S.fromKey("action_link")),
	email: S.optional(S.string),
	phone: S.optional(S.string),
	confirmedAt: S.optional(S.Date).pipe(S.fromKey("confirmed_at")),
	emailConfirmedAt: S.optional(S.Date).pipe(S.fromKey("email_confirmed_at")),
	phoneConfirmedAt: S.optional(S.string).pipe(
		S.fromKey("phone_confirmed_at")
	),
	lastSignInAt: S.optional(S.Date).pipe(S.fromKey("last_sign_in_at")),
	role: S.optional(S.string),
	identities: S.optional(S.array(UserIdentity).pipe(S.mutable)),
	factors: S.optional(S.array(Factor).pipe(S.mutable)),

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
const _Session = S.struct({
	providerToken: S.optional(S.string, { nullable: true }).pipe(
		S.fromKey("provider_token")
	),
	providerRefreshToken: S.optional(S.string, { nullable: true }).pipe(
		S.fromKey("provider_refresh_token")
	),
	accessToken: S.string.pipe(ps, S.fromKey("access_token")),
	refreshToken: S.string.pipe(ps, S.fromKey("refresh_token")),
	expiresIn: S.number.pipe(ps, S.fromKey("expires_in")),
	expiresAt: S.optional(S.number).pipe(S.fromKey("expires_at")),
	tokenType: S.string.pipe(ps, S.fromKey("token_type")),
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
	readonly execute: (_: I) => Effect.Effect<A, ParseError | E, R>;
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
		 * @since 1.0.0
		 */
		schema<
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
		) => Effect.Effect<ReadonlyArray<A>, ParseResult.ParseError, IR | AR>;

		/**
		 * @since 1.0.0
		 */
		schemaVoid<
			IA,
			II,
			IR,
			Q extends PostgrestFilterBuilder<any, any, unknown>
		>(options: {
			request: S.Schema<IA, II, IR>;
			run: (_: II) => Q;
		}): (_: IA) => Effect.Effect<void, ParseResult.ParseError, IR>;

		/**
		 * @since 1.0.0
		 */
		resolver: <
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
		) => Resolver<
			T,
			A,
			IA,
			ResultLengthMismatch | Sb.PostgrestError,
			IR | AR
		>;

		resolverVoid: <
			T extends string,
			IR,
			II,
			IA,
			Q extends PostgrestFilterBuilder<any, any, void>
		>(
			tag: T,
			options: {
				readonly request: S.Schema<IA, II, IR>;
				run: (requests: ReadonlyArray<II>) => Q;
			}
		) => Resolver<
			T,
			void,
			IA,
			ResultLengthMismatch | Sb.PostgrestError,
			IR
		>;

		/**
		 * @since 1.0.0
		 */
		signUp: (
			credentials: Sb.SignUpWithPasswordCredentials
		) => Effect.Effect<{ user?: User; session?: Session }, Sb.AuthError>;

		/**
		 * @since 1.0.0
		 */
		signInWithOAuth: (
			credentials: Sb.SignInWithOAuthCredentials
		) => Effect.Effect<Sb.OAuthResponse>;

		/**
		 * @since 1.0.0
		 */
		signInWithPassword: (
			credentials: Sb.SignInWithPasswordCredentials
		) => Effect.Effect<Sb.AuthTokenResponsePassword>;

		/**
		 * @since 1.0.0
		 */
		getUser: () => Effect.Effect<
			Option.Option<User>,
			ParseResult.ParseError
		>;
	}
>() {}

/**
 * @since 1.0.0
 */
export const layer = (
	supabaseUrl: Config.Config<string>,
	supabaseKey: Config.Config<Secret.Secret>
) =>
	Layer.effect(
		Supabase,
		Effect.gen(function* (_) {
			const [url, key] =
				yield * _(Config.all([supabaseUrl, supabaseKey]));

			const fetch = (yield * _(Effect.serviceOption(Fetch))).pipe(
				Option.getOrUndefined
			);

			const client =
				yield *
				_(
					Effect.sync(() =>
						Sb.createClient(url, Secret.value(key), {
							global: {
								fetch
							}
						})
					)
				);

			const query =
				<A>() =>
				<Q extends PostgrestFilterBuilder<any, any, A>>(
					q: () => Q
				): Effect.Effect<A, Sb.PostgrestError> =>
					Effect.promise((signal) => q().abortSignal(signal)).pipe(
						Effect.flatMap((res) =>
							res.data
								? Effect.succeed(res.data)
								: res.error
									? Effect.fail(res.error)
									: Effect.die(
											new Cause.UnknownException(res)
										)
						)
					);

			const decodeUser = S.decodeUnknown(User);

			const signUp = (credentials: Sb.SignUpWithPasswordCredentials) =>
				Effect.flatMap(
					Effect.promise(() => client.auth.signUp(credentials)),
					(res) =>
						res.data
							? Effect.succeed(res.data)
							: res.error
								? Effect.fail(res.error)
								: Effect.succeed({} as any)
				);

			const signInWithOAuth = (
				credentials: Sb.SignInWithOAuthCredentials
			) => Effect.promise(() => client.auth.signInWithOAuth(credentials));

			const signInWithPassword = (
				credentials: Sb.SignInWithPasswordCredentials
			) =>
				Effect.promise(() =>
					client.auth.signInWithPassword(credentials)
				);

			const getUser = () =>
				Effect.gen(function* (_) {
					const { data } = yield* _(
						Effect.promise(() => client.auth.getUser())
					);

					if (!data) {
						return Option.none<User>();
					}

					const user = yield* _(decodeUser(data.user));
					yield* _(Effect.log(user));
					return Option.some(user);
				});

			const resolver = <
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
			) => {
				const request = Request.tagged<Req<T, A, IA>>(tag);
				const decodeResult = S.decodeUnknown(options.result);
				const encodeRequests = S.encode(S.array(options.request));

				const resolver = RequestResolver.makeBatched(
					(requests: Req<T, A, IA>[]) =>
						pipe(
							encodeRequests(requests.map((r) => r.value)),
							Effect.flatMap((as) =>
								query<unknown[]>()(() => options.run(as))
							),
							Effect.filterOrFail(
								(results) => results.length === requests.length,
								(_) =>
									ResultLengthMismatch(
										requests.length,
										_.length
									)
							),
							Effect.flatMap((results) =>
								Effect.forEach(results, (result, i) =>
									pipe(
										decodeResult(result),
										Effect.flatMap((result) =>
											Request.succeed(requests[i], result)
										),
										Effect.catchAll((error) =>
											Request.fail(
												requests[i],
												error as any
											)
										)
									)
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
					);

				return { request, resolver, execute };
			};

			const resolverVoid = <
				T extends string,
				IR,
				II,
				IA,
				Q extends PostgrestFilterBuilder<any, any, void>
			>(
				tag: T,
				options: {
					readonly request: S.Schema<IA, II, IR>;
					run: (requests: ReadonlyArray<II>) => Q;
				}
			) => {
				const request = Request.tagged<Req<T, void, IA>>(tag);
				const encodeRequests = S.encode(S.array(options.request));

				const resolver = RequestResolver.makeBatched(
					(requests: Req<T, void, IA>[]) =>
						pipe(
							encodeRequests(requests.map((r) => r.value)),
							Effect.flatMap((as) =>
								query<unknown[]>()(() => options.run(as) as any)
							),
							Effect.filterOrFail(
								(results) => results.length === requests.length,
								(_) =>
									ResultLengthMismatch(
										requests.length,
										_.length
									)
							),
							Effect.zipRight(
								Effect.forEach(
									requests,
									(req) =>
										Request.succeed(req, void 0 as any),
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
					);

				return { request, resolver, execute };
			};

			function schema<
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
			}) {
				const decodeResult = S.decodeUnknown(S.array(options.result));
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

			function schemaVoid<
				IA,
				II,
				IR,
				Q extends PostgrestFilterBuilder<any, any, unknown>
			>(options: { request: S.Schema<IA, II, IR>; run: (_: II) => Q }) {
				const encodeRequest = S.encode(options.request);
				return (_: IA) =>
					Effect.asUnit(
						Effect.flatMap(encodeRequest(_), (as) =>
							Effect.promise((signal) =>
								options.run(as).abortSignal(signal)
							)
						)
					);
			}

			return Supabase.of({
				client,
				schema,
				schemaVoid,
				resolver,
				resolverVoid,
				getUser,
				signUp,
				signInWithOAuth,
				signInWithPassword
			});
		})
	);
