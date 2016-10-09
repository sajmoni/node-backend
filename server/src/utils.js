function getDbUrl(env) {
  const services = JSON.parse(env.VCAP_SERVICES);
  return services.cloudantNoSQLDB[0].credentials.url;
}

function getDatabaseViews() {
  return {
    _id: '_design/views',
    views: {
      authenticate: {
        map: function(doc) {
          if (doc.type === 'user') {
            emit(doc.email, doc.password);
          }
        }
      },
      user: {
        map: function(doc) {
          if (doc.type === 'user') {
            emit(doc._id, {
              name: doc.name
            });
          }
        }
      }
    }
  };
}

module.exports = { getDbUrl, getDatabaseViews };