let lrs;

const connect = () => {
  try {
    lrs = new TinCan.LRS({
      endpoint: "https://cloud.scorm.com/lrs/ESSS8PGA5M/",
      username: "ESSS8PGA5M",
      password: "iLJq7AazKGWwGYPT1QGjbTrmg2G7pUOstntjd9gd",
      allowFail: false,
    });

    console.log(lrs);
  } catch (ex) {
    console.log("Failed to setup LRS object: ", ex);
  }
};

connect();

let statement = new TinCan.Statement({
  actor: {
    mbox: "mailto:info@tincanapi.com",
  },
  verb: {
    id: "http://adlnet.gov/expapi/verbs/experienced",
  },
  target: {
    id: "http://rusticisoftware.github.com/TinCanJS",
  },
});


lrs.saveStatement(
    statement,
    {
        callback: function (err, xhr) {
            if (err !== null) {
                if (xhr !== null) {
                    console.log("Failed to save statement: " + xhr.responseText + " (" + xhr.status + ")");
                    // TODO: do something with error, didn't save statement
                    return;
                }

                console.log("Failed to save statement: " + err);
                // TODO: do something with error, didn't save statement
                return;
            }

            console.log("Statement saved");
            // TOOO: do something with success (possibly ignore)
        }
    }
);



