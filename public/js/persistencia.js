firebase.firestore().settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
  });

firebase.firestore().enablePersistence().then(function() {

    //sucesso

}).catch(function(err) {
    if (err.code == 'failed-precondition') {

        //multiplas abas abertas

    } else if (err.code == 'unimplemented') {

        //o navegador nao suporta o cache do Firebase Firestore
        
    }
});