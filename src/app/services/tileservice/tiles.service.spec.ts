/*
 * Copyright (c) 2022. Deutsche Telekom AG
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { TestBed, waitForAsync } from '@angular/core/testing';
import { Tile } from '../../model/tile';
import { TilesService } from './tiles.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';

// https://dev.to/coly010/unit-testing-angular-services-1anm

/**
 * describe sets up the Test Suite for the TileService
 */
describe('TilesService', () => {
  /**
   * let service declares a Test Suite-scoped variable where we will store a reference to our service
   */
  let service: TilesService;
  let mockTile: Tile;
  let httpmock: HttpTestingController;
  let errmsg: string;

  const backendServerUrlTest = environment.backendServerUrl + '/tiles';
  /**
   * beforeEach tells the test runner to run this code before every test in the Test Suite
   * It is using Angular's TestBed to create the testing environment. Finally it is injecting the TilesService
   * and placing a reference to it in the service variable defined earlier.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TilesService, OAuthService, UrlHelperService, OAuthLogger],
    });
    service = TestBed.inject(TilesService);
    httpmock = TestBed.inject(HttpTestingController);
    mockTile = {
      id: 1,
      title: 'NewTile1',
      description: 'New Tile for frontend test',
      imageUrl: 'https://www.onap.org/wp-content/uploads/sites/20/2017/02/logo_onap_2017.png',
      imageAltText: 'Onap Image',
      redirectUrl: 'www.onap.org',
      headers: 'This is a header',
      groups: [],
      roles: [],
    };
    // responseTile = {
    //   id: 2,
    //   title: 'NewTile1',
    //   description: 'New Tile for frontend test',
    //   imageUrl: 'https://www.onap.org/wp-content/uploads/sites/20/2017/02/logo_onap_2017.png',
    //   imageAltText: 'Onap Image',
    //   redirectUrl: 'www.onap.org',
    //   headers: 'This is a header',
    //   groups: [],
    //   roles: [],
    // };
  });

  /**
   * After every test, assert that there are no more pending requests.
   */
  afterEach(() => {
    httpmock.verify();
  });

  /**
   * the it() function creates a new test with the title 'should be created'
   * This test is expecting the service varibale to truthy, in otherwords,
   * it should have been instantiated correctly by the Angular TestBed.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * TileService method tests begin
   * Testing getTiles
   */
  describe('#getTiles', () => {
    // let expectedTiles: Tile[];

    beforeEach(() => {
      // expectedTiles = [mockTile, responseTile];
    });

    /**
     * testing method getTiles() to get all existing tiles
     */
    /*
    it('should return expected tiles (called once)', (done: DoneFn) => {
      service.getTiles().subscribe(response => {
        expect(response).toEqual(expectedTiles, 'should return expected tiles');
        // done() to be called after asynchronous calls (https://angular.io/guide/testing-services)
        done();
      });

      // TileService should have made one request to GET tiles from expected URL
      const req = httpmock.expectOne(backendServerUrlTest);
      expect(req.request.method).toEqual('GET');

      // Respond with the expected mock tiles
      req.flush(expectedTiles);
    });
*/
    /**
     * TODO: Maybe it makes sense to inform the user that no tiles are displayed
     * testing method getTiles() in case there are no tiles in the database
     */
    /*
    it('should be OK returning no tiles', (done: DoneFn) => {
      service.getTiles().subscribe(response => {
        expect(response.length).toEqual(0, 'should have empty tiles array');
        done();
      });

      const req = httpmock.expectOne(backendServerUrlTest);
      expect(req.request.method).toEqual('GET');

      req.flush([]); // Respond with no tile
    });
*/
    /**
     * testing method getTiles() in case the backend responds with 404 Not Found
     * This service reports the error but finds a way to let the app keep going.
     */

    /*
    it('should handle 404 error', (done: DoneFn) => {
      errmsg = '404 error';

      service.getTiles().subscribe(
        response => fail('should fail with the 404 error'),
        (err: HttpErrorResponse) => {
          expect(err.status).toEqual(404);
          expect(err.error).toEqual(errmsg);
        },
      );

      // Make an HTTP Get Request
      // service.getTiles().then(
      //     response => fail('should have failed with the 404 error'),
      //       (err: HttpErrorResponse) => {
      //         expect(err.status).toEqual(404);
      //         expect(err.error).toEqual(errmsg);
      //       }
      // );

      const req = httpmock.expectOne(backendServerUrlTest);
      expect(req.request.method).toEqual('GET');

      // respond with a 404 and the error message in the body --> TODO Frontend GUI must react correctly
      req.flush(errmsg, { status: 404, statusText: 'Not Found' });
    });
     */

    /**
     * testing getTiles() when method is called multiple times
     * TODO: expect cached results
     */
    /*
    it('should return expected tiles (called multiple times)', () => {
      service.getTiles().subscribe();
      service.getTiles().subscribe();
      service.getTiles().subscribe(response => {
        expect(response).toEqual(expectedTiles, 'should return expected tiles');
      });

      const req = httpmock.match(backendServerUrlTest);
      expect(req.length).toEqual(3, 'calls to getTiles()');

      // Respond to each request with different mock tile results
      req[0].flush([]);
      req[1].flush([mockTile]);
      req[2].flush(expectedTiles);
    });*/
  });

  /**
   * Tests for getTileByID()
   */
  describe('#getTileByID', () => {
    /**
     * testing method getTilesById() to return the specific tile with right id
     */
    it('should return expected tile by id', () => {
      service.getTileById(mockTile.id).then(response => {
        expect(response).toEqual(mockTile, 'should return expected tile');
      });

      const req = httpmock.expectOne(backendServerUrlTest + '/' + mockTile.id);
      expect(req.request.method).toEqual('GET');

      // Respond with the mock tiles
      req.flush(mockTile);
    });

    /**
     * testing method getTileByID() in case the backend responds with 404 Not Found and the tile does not exist
     */
    it('getTileById(): should handle 404 error', waitForAsync(() => {
      errmsg = '404 error';
      // Make an HTTP Get Request
      service.getTileById(mockTile.id).then(
        () => fail('should have failed with the 404 error'),
        (err: HttpErrorResponse) => {
          expect(err.status).toEqual(404);
          expect(err.error).toEqual(errmsg);
        },
      );

      const req = httpmock.expectOne(backendServerUrlTest + '/' + mockTile.id);
      expect(req.request.method).toEqual('GET');

      req.flush(errmsg, { status: 404, statusText: 'Not Found' });
    }));
  });
  /**
   * Tests for update an existing tile
   */
  describe('#updateTiles', () => {
    /**
     * testing method updateTiles()
     */
    it('should update a tile and return it', () => {
      mockTile.title = 'Update title';

      service.updateTiles(mockTile).then(response => {
        expect(response.title).toEqual('Update title', 'should return tile');
      });
      // TileService should have made one request to PUT
      const req = httpmock.expectOne(backendServerUrlTest + '/' + mockTile.id);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(mockTile);

      req.flush(mockTile);
    });

    /**
     * testing method updateTiles() in case the backend responds with 404 Not Found and the tile does not exist
     */
    it('updateTiles(): should handle 404 error', waitForAsync(() => {
      errmsg = '404 error';
      // Make an HTTP Get Request
      service.updateTiles(mockTile).then(
        () => fail('should have failed with the 404 error'),
        (err: HttpErrorResponse) => {
          expect(err.status).toEqual(404);
          expect(err.error).toEqual(errmsg);
        },
      );

      const req = httpmock.expectOne(backendServerUrlTest + '/' + mockTile.id);
      expect(req.request.method).toEqual('PUT');

      req.flush(errmsg, { status: 404, statusText: 'Not Found' });
    }));

    /**
     * testing method updateTiles() in case the backend responds with 401 Unauthorized
     */
    it('updateTiles(): should handle 401 error', waitForAsync(() => {
      errmsg = '401 error';
      // Make an HTTP Get Request
      service.updateTiles(mockTile).then(
        () => fail('should have failed with the 401 error'),
        (err: HttpErrorResponse) => {
          expect(err.status).toEqual(401);
          expect(err.error).toEqual(errmsg);
        },
      );

      const req = httpmock.expectOne(backendServerUrlTest + '/' + mockTile.id);
      expect(req.request.method).toEqual('PUT');

      req.flush(errmsg, { status: 401, statusText: 'Not Found' });
    }));

    /**
     * testing method updateTiles() in case the backend responds with 403 Forbidden
     */
    it('updateTiles(): should handle 403 error', waitForAsync(() => {
      errmsg = '403 error';
      // Make an HTTP Get Request
      service.updateTiles(mockTile).then(
        () => fail('should have failed with the 404 error'),
        (err: HttpErrorResponse) => {
          expect(err.status).toEqual(403);
        },
      );

      const req = httpmock.expectOne(backendServerUrlTest + '/' + mockTile.id);
      expect(req.request.method).toEqual('PUT');

      req.flush(errmsg, { status: 403, statusText: 'Not Found' });
    }));
  });
  /*
   *  Test save a new tile
   */
  describe('#saveTiles', () => {
    /*
     * testing saveTiles() to save a new tile
     */
    it('should save a tile correctly (mocked http post request)', waitForAsync(() => {
      service.saveTiles(mockTile).then(response => {
        expect(response.id).toBe(1);
        expect(response.title).toBe('NewTile1');
        expect(response.redirectUrl).toBe('www.onap.org');
        expect(response.imageAltText).toBe('Onap Image');
        expect(response.imageUrl).toBe('https://www.onap.org/wp-content/uploads/sites/20/2017/02/logo_onap_2017.png');
        expect(response.description).toBe('New Tile for frontend test');
        expect(response.headers).toBe('This is a header');
      });
      /*
       * Checking that there ist just one request and check the type of request
       * 'flush'/ respond with mock data, run then-block in line 64 and check the except commands
       */
      const req = httpmock.expectOne(backendServerUrlTest);
      expect(req.request.method).toEqual('POST');
      req.flush(mockTile);
    }));
    /**
     * testing method saveTiles() in case the backend answers with an 401 responds
     */
    it('saveTiles(): should handle 401 error', waitForAsync(() => {
      errmsg = '401 error';
      // Make an HTTP Get Request
      service.saveTiles(mockTile).then(
        () => fail('should have failed with the 401 error'),
        (err: HttpErrorResponse) => {
          expect(err.status).toEqual(401);
          expect(err.error).toEqual(errmsg);
        },
      );

      const req = httpmock.expectOne(backendServerUrlTest);
      expect(req.request.method).toEqual('POST');

      req.flush(errmsg, { status: 401, statusText: 'Not Found' });
    }));

    it('saveTiles(): should handle 403 error', waitForAsync(() => {
      errmsg = '403 error';
      // Make an HTTP Get Request
      service.saveTiles(mockTile).then(
        () => fail('should have failed with the 401 error'),
        (err: HttpErrorResponse) => {
          expect(err.status).toEqual(403);
          expect(err.error).toEqual(errmsg);
        },
      );

      const req = httpmock.expectOne(backendServerUrlTest);
      expect(req.request.method).toEqual('POST');

      req.flush(errmsg, { status: 403, statusText: 'Forbidden' });
    }));
  });
  /**
   * testing delete a tile
   */
  describe('#deleteTiles', () => {
    /**
     * testing method deleteTile()
     */
    it('should delete a tile correctly (mocked http delete request)', waitForAsync(() => {
      service.deleteTile(mockTile).then(response => {
        expect(response).toBeDefined();
      });
      const req = httpmock.expectOne(environment.backendServerUrl + '/tiles/' + mockTile.id);
      expect(req.request.method).toEqual('DELETE');
      req.flush({});
    }));

    /**
     * testing method deleteTiles() in case the backend responds with 404 Not Found and the tile does not exist
     */
    it('deleteTiles(): should handle 404 error', waitForAsync(() => {
      errmsg = '404 error';
      // Make an HTTP Get Request
      service.deleteTile(mockTile).then(
        () => fail('should have failed with the 404 error'),
        (err: HttpErrorResponse) => {
          expect(err.status).toEqual(404);
          expect(err.error).toEqual(errmsg);
        },
      );

      const req = httpmock.expectOne(backendServerUrlTest + '/' + mockTile.id);
      expect(req.request.method).toEqual('DELETE');

      req.flush(errmsg, { status: 404, statusText: 'Not Found' });
    }));

    /**
     * testing method deleteTiles() in case the backend responds with 401 Unauthorized
     */
    it('deleteTiles(): should handle 401 error', waitForAsync(() => {
      errmsg = '401 error';
      // Make an HTTP Get Request
      service.deleteTile(mockTile).then(
        () => fail('should have failed with the 401 error'),
        (err: HttpErrorResponse) => {
          expect(err.status).toEqual(401);
          expect(err.error).toEqual(errmsg);
        },
      );

      const req = httpmock.expectOne(backendServerUrlTest + '/' + mockTile.id);
      expect(req.request.method).toEqual('DELETE');

      req.flush(errmsg, { status: 401, statusText: 'Unauthorized' });
    }));

    /**
     * testing method deleteTiles() in case the backend responds with 403 Forbidden
     */
    it('deleteTiles(): should handle 403 error', waitForAsync(() => {
      errmsg = '403 error';
      // Make an HTTP Get Request
      service.deleteTile(mockTile).then(
        () => fail('should have failed with the 404 error'),
        (err: HttpErrorResponse) => {
          expect(err.status).toEqual(403);
          expect(err.error).toEqual(errmsg);
        },
      );

      const req = httpmock.expectOne(backendServerUrlTest + '/' + mockTile.id);
      expect(req.request.method).toEqual('DELETE');

      req.flush(errmsg, { status: 403, statusText: 'Forbidden' });
    }));
  });
});
