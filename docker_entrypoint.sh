#!/usr/bin/env sh
#
#
# Copyright (c) 2022. Deutsche Telekom AG
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# SPDX-License-Identifier: Apache-2.0
#
#
#

set -eu

envsubst '${BFF_URL} ${NGINX_PORT} ${KEYCLOAK_URL} ${KEYCLOAK_REALM} ${KEYCLOAK_INTERNAL_URL} ${CLUSTER_NAMESERVER_IP}' < ./nginx.template > /etc/nginx/conf.d/default.conf

# dynamically set Angular environment config upon container startup
envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js

exec "$@"
