import { defineContract } from '@prisma/orm-postgres/contract-builder';

export const contract = defineContract({}, ({ field, model, rel }) => {
  const User = model('User', {
    fields: {
      id: field.id.uuidv7String(),
      email: field.text().unique(),
      name: field.text().optional(),
      image: field.text().optional(),
      createdAt: field.temporal.createdAt(),
    },
  });

  const Account = model('Account', {
    fields: {
      id: field.id.uuidv7String(),
      userId: field.uuidString(),
      type: field.text(),
      provider: field.text(),
      providerAccountId: field.text(),
      refresh_token: field.text().optional(),
      access_token: field.text().optional(),
      expires_at: field.int().optional(),
      token_type: field.text().optional(),
      scope: field.text().optional(),
      id_token: field.text().optional(),
      session_state: field.text().optional(),
      createdAt: field.temporal.createdAt(),
      updatedAt: field.temporal.updatedAt(),
    },
  });

  const Session = model('Session', {
    fields: {
      id: field.id.uuidv7String(),
      sessionToken: field.text().unique(),
      userId: field.uuidString(),
      expires: field.temporal.timestamp(),
      createdAt: field.temporal.createdAt(),
      updatedAt: field.temporal.updatedAt(),
    },
  });

  const Ping = model('Ping', {
    fields: {
      id: field.id.uuidv7String(),
      userId: field.uuidString(),
      content: field.text(),
      createdAt: field.temporal.createdAt(),
      updatedAt: field.temporal.updatedAt(),
      deletedAt: field.temporal.timestamp().optional(),
    },
  });

  return {
    models: {
      User: User.relations({
        accounts: rel.hasMany(Account, { by: 'userId' }),
        sessions: rel.hasMany(Session, { by: 'userId' }),
        pings: rel.hasMany(Ping, { by: 'userId' }),
      }),
      Account: Account.relations({
        user: rel.belongsTo(User, { from: 'userId', to: 'id' }),
      }),
      Session: Session.relations({
        user: rel.belongsTo(User, { from: 'userId', to: 'id' }),
      }),
      Ping: Ping.relations({
        user: rel.belongsTo(User, { from: 'userId', to: 'id' }),
      }),
    },
  };
});