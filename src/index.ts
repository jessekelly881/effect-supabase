/**
 * @since 1.0.0
 */

import * as Sb from "@supabase/supabase-js";
import { Schema as S, ParseResult } from "@effect/schema";
import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import {
	Effect,
	Option,
	Layer,
	Data,
	Request,
	RequestResolver,
	pipe
} from "effect";
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
		ResultLengthMismatch | ParseResult.ParseError
	> {
	readonly value: IA;
	readonly _tag: T;
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
		client: Sb.SupabaseClient<any, never, any>;

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
		) => {
			request: Request.Request.Constructor<Req<T, A, IA>, "_tag">;
			resolver: RequestResolver.RequestResolver<Req<T, A, IA>, IR | AR>;
			execute: (
				i: IA
			) => Effect.Effect<
				A,
				ParseResult.ParseError | ResultLengthMismatch,
				IR | AR
			>;
		};

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
export const layer = (...params: Parameters<typeof Sb.createClient>) =>
	Layer.effect(
		Supabase,
		Effect.gen(function* (_) {
			const client = yield* _(
				Effect.sync(() => Sb.createClient(...params))
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
							Effect.flatMap(
								(as) =>
									Effect.promise((signal) =>
										options.run(as).abortSignal(signal)
									) // supply client instance (items, client) => ...
							),
							Effect.map((s) => s.data || []),
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

			return Supabase.of({
				client,
				getUser,
				signUp,
				signInWithOAuth,
				signInWithPassword,
				resolver
			});
		})
	);
