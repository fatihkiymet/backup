(function (A) {
    A.dataColumn = function (name, caption, formatFn) {
        this.name = name;
        this.caption = caption;
        this.formatFn = formatFn;
    }

    A.simpleDataStore = function (id) {
        this.Id = id || guidGenerator();
        this.loadOnDemand = loadOnDemand === true ? loadOnDemand : false;

        this.data = [];
        this.columns = [ new A.dataColumn("name"), new A.dataColumn("value") ];
        this.getData = function(dataStoreId){
            if(window[dataStoreId] != null && $.isArray(window[dataStoreId]))
            {
                this.data = window[dataStoreId];
            }            

            return this.data;
        }
    };
    
    A.ajaxDataStore = function (id, loadOnDemand, url, params, columns) {
        A.simpleDataStore.call(this, [id]);
        this.url = url;
        this.params = params;
        if (columns && columns.length > 0) {
            this.columns = columns;
        }

        var self = this;

        this.getData = function () {
            A.ajax.post({
                url: self.url,
                data: self.params,
                onSuccess: function (data) {
                    if (data && $.isArray(data)) {
                        if (self.columns && self.columns.length > 0) {
                            $.each(data, function (i, row) {
                                var r = [];
                                $.each(self.columns, function (i, col) {
                                    r.push(row[col.Name]);
                                });
                                self.data.push(r);
                            });
                        }
                        else {
                            self.data = data;
                            return;
                        }
                    }
                }
            });
        };

        if (!this.loadOnDemand)
        {
            this.getData();
        }
    };

})(akbank);