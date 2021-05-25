const formValidErrObj = {};
export default {
  methods: {
    /* 异步验证混入函数
         * beforeValid 非必填 返回true 表示直接通过验证
         * params 非必填 默认传参source对象 如果传入，就用 params 函数返回的 参数。
         */
    formValid (rule, value, callback, source) {
      if (typeof rule.beforeValid === 'function' && rule.beforeValid.call(this)) {
        callback();
        return;
      }
      const validKey = rule.url + rule.message;
      if (!this._currentValue) this._currentValue = {};
      if (this._currentValue[validKey] === value) {
        callback(formValidErrObj[validKey]);
        return;
      }
      let params = Object.assign({}, source);
      // 有的接口返回的是 true ， 但是要验证通过。也就是说翻转。
      let isReverse = false;
      if (typeof rule.params === 'function') {
        params = rule.params.call(this, value, rule);
        if (params.reverse) {
          isReverse = true;
          delete params.reverse;
        }
      }

      if (rule.url) {
        this.validating = this.Http(rule.url, params).then(result => {
          delete formValidErrObj[validKey];
          if ((result.data && !isReverse) || (!result.data && isReverse)) {
            formValidErrObj[validKey] = result.message || rule.message;
            if (rule.errorCallback) {
              rule.errorCallback.call(this);
            }
            callback(formValidErrObj[validKey]);
          } else {
            if (rule.callback) {
              rule.callback.call(this);
            }
            callback();
          }
        }).catch(errors => {
          formValidErrObj[validKey] = errors.res.message || rule.message;
          if (rule.errorCallback) {
            rule.errorCallback.call(this);
          }
          callback(formValidErrObj[validKey]);
        }).finally(() => {
          this.validating = false;
          this._currentValue[validKey] = value;
        });
      } else {
        formValidErrObj[validKey] = '异步验证缺少参数:[url]';
        this.$message(formValidErrObj[validKey]);
        callback(formValidErrObj[validKey]);
      }
    }
  }
};