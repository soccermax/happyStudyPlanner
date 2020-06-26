"use strict";

const axios = require("axios");
const { uuid } = require("uuidv4");
const { getUserById } = require("../util/retrieve");

const _requestOAuthAccessToken = async () => {
  const clientId = "amzn1.application-oa2-client.2f90a17556b34e04ad44d9776d713c7a";
  const clientSecret = "cd733983bf86f0a4e626953f2e2d0f48e2f65c845d7c65aebc007ed4d7426016";
  const url = `https://api.amazon.com/auth/O2/token`;
  const data = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}&scope=alexa::proactive_events`;
  const config = {
    url,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data,
  };
  try {
    const response = await axios(config);
    return response.data.access_token;
  } catch (err) {
    console.error(err);
    return err;
  }
};

const triggerNotification = async (studentId, live = false) => {
  const [student, accessToken] = await Promise.all([getUserById(studentId), _requestOAuthAccessToken()]);
  if (!accessToken) {
    throw new Error("Can't find accessToken");
  }
  const url = `https://api.eu.amazonalexa.com${
    live ? "/v1/proactiveEvents" : "/v1/proactiveEvents/stages/development"
  }`;
  const config = {
    data: getNotificationTemplate(student),
    url,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const result = await axios(config);
  return result;
};

const getNotificationTemplate = (studentName) => {
  // Sets timestamp to current date and time
  let timestamp = new Date();
  timestamp = timestamp.toISOString();

  // Sets expiryTime 23 hours ahead of the current date and time
  let expiryTime = new Date();
  expiryTime.setHours(expiryTime.getHours() + 23);
  expiryTime = expiryTime.toISOString();
  return {
    timestamp: timestamp,
    referenceId: uuid(),
    expiryTime: expiryTime,
    event: {
      name: "AMAZON.MessageAlert.Activated",
      payload: {
        state: {
          status: "UNREAD",
          freshness: "NEW",
        },
        messageGroup: {
          creator: {
            name: `einem unbearbeiteten Learning Agreement von ${studentName.preName} ${studentName.name}`,
          },
          count: 1,
        },
      },
    },
    localizedAttributes: [],
    relevantAudience: {
      type: "Multicast",
      payload: {},
    },
  };
};

module.exports = {
  triggerNotification,
};
