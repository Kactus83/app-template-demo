import { Injectable } from '@angular/core';
import { MetadataDto } from '../models/dto/metadata.dto';

/**
 * Service fournissant les métadonnées du client
 * liées uniquement à l’appareil et au navigateur.
 *
 * @category Metadata
 * @subcategory Services
 */
@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  /**
   * Construit et renvoie un objet MetadataDto.
   */
  getMetadata(): MetadataDto {
    const now = new Date();
    const ua = navigator.userAgent;
    const locale = navigator.language || 'unknown';
    const timeZone =
      Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown';
    const screenRes = `${screen.width}x${screen.height}`;
    const { browser, os, device } = this.parseUserAgent(ua);

    return {
      timestamp: now.toISOString(),
      locale,
      timeZone,
      userAgent: ua,
      browserName: browser.name,
      browserVersion: browser.version,
      osName: os.name,
      osVersion: os.version,
      deviceType: device.type,
      screenResolution: screenRes,
    };
  }

  /**
   * Analyse basique de la chaîne userAgent.
   * À remplacer par UAParser.js si besoin de précision.
   */
  private parseUserAgent(ua: string): {
    browser: { name: string; version: string };
    os: { name: string; version: string };
    device: { type: 'desktop' | 'tablet' | 'mobile' };
  } {
    // Browser
    let browserName = 'unknown';
    let browserVersion = 'unknown';
    if (ua.includes('Chrome/')) {
      browserName = 'Chrome';
      browserVersion = ua.split('Chrome/')[1].split(' ')[0];
    } else if (ua.includes('Firefox/')) {
      browserName = 'Firefox';
      browserVersion = ua.split('Firefox/')[1].split(' ')[0];
    }

    // OS
    let osName = 'unknown';
    let osVersion = 'unknown';
    if (ua.includes('Windows NT')) {
      osName = 'Windows';
      osVersion = ua.split('Windows NT ')[1].split(';')[0];
    } else if (ua.includes('Mac OS X')) {
      osName = 'macOS';
      osVersion = ua
        .split('Mac OS X ')[1]
        .split(')')[0]
        .replace(/_/g, '.');
    }

    // Device type
    const type: 'desktop' | 'tablet' | 'mobile' = /Mobi|Android/i.test(ua)
      ? 'mobile'
      : /Tablet|iPad/i.test(ua)
      ? 'tablet'
      : 'desktop';

    return {
      browser: { name: browserName, version: browserVersion },
      os: { name: osName, version: osVersion },
      device: { type },
    };
  }
}
