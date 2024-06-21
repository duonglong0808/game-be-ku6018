export const messageResponse = {
  system: {
    badRequest: 'bad_request',
    emailNotInvalid: 'email_invalid',
    phoneNumberInvalid: 'phone_number_invalid',
    missingData: 'missing_data',
    notFound: 'not_found',
    duplicateData: 'duplicate_data',
    idInvalid: 'id_invalid',
    dataInvalid: 'data_invalid',
  },
  auth: {
    userNotFound: 'user_not_found',
    password_wrong: 'password_wrong',
    userHasBlocked: 'user_has_blocked',
    cannot_access_cms: 'cannot_access_cms',
  },
  group: {
    notFound: 'group_not_found',
    missingData: 'missing_data',
    duplicate: 'duplicate_group',
  },
  payment: {
    paymentTypeIdNotFound: 'payment_type_not_found',
    bankNotFound: 'bank_not_found',
    bankHasExist: 'bank_has_exist',
  },
  paymentTransaction: {
    transactionHasUpdate: 'transaction_has_update',
  },
  banks: {
    numberBanksMax: 'number_banks_max',
  },
  diceDetail: {
    transactionIsRunning: 'transaction_dice_is_running',
    transactionIsFinished: 'transaction_dice_is_finished',
  },
  baccaratDetail: {
    transactionIsRunning: 'transaction_baccarat_is_running',
    transactionIsFinished: 'transaction_baccarat_is_finished',
  },
  historyPlay: {
    transactionIsFinished: 'transaction_is_finished',
    positionHasChoice: 'position_has_choice',
    accountNotHaveEnoughPoints: 'account_not_have_enough_points',
    outsideBettingTime: 'outside_betting_time',
    cannotChooseAnswer: 'cannot_choose_answer',
  },
  userPoint: {
    accountNotHaveEnoughPoints: 'account_not_have_enough_points',
  },
};
