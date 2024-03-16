import type * as Sb from "@supabase/supabase-js";
import * as S from "@effect/schema/Schema";

const ps = S.propertySignature;

/** @internal */
const TimeStamped = S.struct({
	createdAt: S.Date.pipe(ps, S.fromKey("created_at")),
	updatedAt: S.Date.pipe(ps, S.fromKey("updated_at"))
});

export const UserId = S.UUID.pipe(S.brand("UserId"));

export const _AppMetadata = S.struct(
	{ provider: S.optional(S.string) },
	S.record(S.string, S.unknown)
);

export interface AppMetadata extends S.Schema.Type<typeof _AppMetadata> {}
export const AppMetadata: S.Schema<AppMetadata, Sb.UserAppMetadata> =
	_AppMetadata;

export const _UserMetadata = S.record(S.string, S.unknown) satisfies S.Schema<
	any,
	Sb.UserMetadata
>;

export interface UserMetadata extends S.Schema.Type<typeof _UserMetadata> {}
export const UserMetadata: S.Schema<UserMetadata, Sb.UserMetadata> =
	_UserMetadata;

export const _UserIdentity = S.struct({
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

export interface UserIdentity extends S.Schema.Type<typeof _UserIdentity> {}
export const UserIdentity: S.Schema<UserIdentity, Sb.UserIdentity> =
	_UserIdentity;

const _Factor = S.struct({
	id: S.string,
	friendlyName: S.optional(S.string).pipe(S.fromKey("friendly_name")),
	factorType: S.string.pipe(ps, S.fromKey("factor_type")),
	status: S.literal("verified", "unverified"),
	...TimeStamped.fields
});

export interface Factor extends S.Schema.Type<typeof _Factor> {}
export const Factor: S.Schema<Factor, Sb.Factor> = _Factor;

export const _User = S.struct({
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

export interface User extends S.Schema.Type<typeof _User> {}
export const User: S.Schema<User, Sb.User> = _User;

export const _Session = S.struct({
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

export interface Session extends S.Schema.Type<typeof _Session> {}
export const Session: S.Schema<Session, Sb.Session> = _Session;
