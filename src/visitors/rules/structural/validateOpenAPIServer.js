/* eslint-disable class-methods-use-this */
import { createErrorMissingRequiredField, createErrrorFieldTypeMismatch } from '../../../error';

import isRuleEnabled from '../../utils';
import AbstractVisitor from '../../utils/AbstractVisitor';

class ValidateOpenAPIServer extends AbstractVisitor {
  static get ruleName() {
    return 'server';
  }

  validators() {
    return {
      url: (node, ctx) => {
        if (!node || !node.url || typeof node.url !== 'string') return createErrorMissingRequiredField('url', node, ctx, { fromRule: this.rule, severity: this.config.level });
        if (typeof node.url !== 'string') return createErrrorFieldTypeMismatch('string', node, ctx, { fromRule: this.rule, severity: this.config.level });
        return null;
      },
      description: (node, ctx) => (node && node.description && typeof node.description !== 'string'
        ? createErrrorFieldTypeMismatch('string', node, ctx, { fromRule: this.rule, severity: this.config.level }) : null),
    };
  }

  OpenAPIServer() {
    return {
      onEnter: (node, definition, ctx) => {
        const result = [];
        const validators = this.validators();
        const vals = Object.keys(validators);
        for (let i = 0; i < vals.length; i += 1) {
          if (isRuleEnabled(this, vals[i])) {
            ctx.path.push(vals[i]);
            const res = validators[vals[i]](node, ctx, this.config);
            if (res) {
              if (Array.isArray(res)) result.push(...res);
              else result.push(res);
            }
            ctx.path.pop();
          }
        }
        return result;
      },
    };
  }
}

module.exports = ValidateOpenAPIServer;