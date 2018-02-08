const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

function update({ petId, userId, setVal, transactionFn }) {

  return Promise.all([
    admin.database()
      .ref('petsFavoritedBy')
      .child(petId)
      .child(userId)
      .set(setVal),
    admin.database()
      .ref('petsFavoriteCount')
      .child(petId)
      .transaction(transactionFn)
  ]);
}


exports.trackAddFavorite = functions.database.ref('/users/{userId}/favorites/{petId}')
  .onCreate(event => {

    const { userId, petId } = event.params;

    return update({
      petId,
      userId,
      setVal: true,
      transactionFn: currentCount => {
        if(!currentCount) return 1;
        return currentCount + 1
      }
    });
  });

exports.trackRemoveFavorite = functions.database.ref('/users/{userId}/favorites/{petId}')
  .onDelete(event => {

    const { userId, petId } = event.params;

    return update({
      petId,
      userId,
      setVal: null,
      transactionFn: currentCount => {
        if(!currentCount) return 0;
        return currentCount - 1
      }
    });

  });





// exports.trackAddFavorite = functions.database.ref('/users/{userId}/favorites/{petId}')
//   .onCreate(event => {

//     const { userId, petId } = event.params;

//     return Promise.all([
//       admin.database()
//         .ref('petsFavoritedBy')
//         .child(petId)
//         .child(userId)
//         .set(true),
//       admin.database()
//         .ref('petsFavoriteCount')
//         .child(petId)
//         .transaction(currentCount => {
//           if(!currentCount) return 1;
//           return currentCount + 1
//         })
//     ]);
//   });

// exports.trackRemoveFavorite = functions.database.ref('/users/{userId}/favorites/{petId}')
//   .onDelete(event => {

//     const { userId, petId } = event.params;

//     return Promise.all([
//       admin.database()
//         .ref('petsFavoritedBy')
//         .child(petId)
//         .child(userId)
//         .set(null),
//       admin.database()
//         .ref('petsFavoriteCount')
//         .child(petId)
//         .transaction(currentCount => {
//           if(!currentCount) return 0;
//           return currentCount - 1
//         })
//     ]);
//   });



