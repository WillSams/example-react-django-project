import { call, takeLatest, put } from 'typed-redux-saga';

import { actionTypes, onFailure, onSuccessful } from '@/shared/base';
import {
  fetchQuery,
  getExistingReservationsQuery,
  GetAllReservationsResponse,
} from '@/shared/graphql';

type GetAllReservationsAction = {
  type: string;
};

export function* getAllReservations(_action: GetAllReservationsAction) {
  try {
    const variables = {};
    const response: GetAllReservationsResponse = yield* call(
      fetchQuery,
      getExistingReservationsQuery,
      variables,
    );

    const data = response?.data;
    const errors = data?.getAllReservations?.errors;

    if (errors)
      throw new Error(
        `getallreservations-saga-error:  ${JSON.stringify(errors)}`,
      );
    else {
      const { reservations } = data.getAllReservations || [];
      yield* put({
        type: onSuccessful(actionTypes.GET_RESERVATIONS),
        response: {
          data: reservations,
        },
      });
    }
  } catch (ex) {
    const message = `Could not retrieve reservations.  ${ex}`;
    yield* put({
      type: onFailure(actionTypes.GET_RESERVATIONS),
      alertType: 'danger',
      message,
    });
    yield* put({
      type: actionTypes.SET_ALERT,
      alertType: 'danger',
      message,
    });
  }
}

function* saga() {
  yield* takeLatest(actionTypes.GET_RESERVATIONS, getAllReservations);
}

export default saga;
export type { GetAllReservationsAction };
